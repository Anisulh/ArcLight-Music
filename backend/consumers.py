import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Room, Guest
from urllib.parse import urlparse


class ChatConsumer(AsyncJsonWebsocketConsumer):
    @database_sync_to_async
    def create_chat(self, guest_id, message):
        room = Room.objects.get(pk=self.room_name)
        guest = Guest.objects.get(pk=guest_id)
        instance = Message.objects.create(user=guest, room=room, content=message)
        nickname = guest.nickname
        _id = instance.pk
        return {"_id": _id, "nickname": nickname}

    @database_sync_to_async
    def get_guest(self, guest_id):
        guest = Guest.objects.get(pk=guest_id)
        return guest.nickname

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        # Send message to room group
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print("recieved")
        print(text_data_json)

        # Send message to room group
        if "connection" in text_data_json:
            print(text_data_json["connection"])
            guest = text_data_json["connection"]["guest_id"]
            nickname = await self.get_guest(guest)
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "connect_message", "guest": nickname},
            )
        else:
            message = text_data_json["message"]
            guest_id = text_data_json["guest_id"]
            data = await self.create_chat(guest_id, message)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "guest_id": guest_id,
                    "_id": data["_id"],
                    "nickname": data["nickname"],
                },
            )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        guest_id = event["guest_id"]
        _id = event["_id"]
        nickname = event["nickname"]
        # Send message to WebSocket
        await self.send(
            text_data=json.dumps(
                {
                    "message": {
                        "_id": _id,
                        "guest_id": guest_id,
                        "nickname": nickname,
                        "message": message,
                    }
                }
            )
        )

    async def connect_message(self, event):
        guest = event["guest"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"connection": {"guest": guest}}))
