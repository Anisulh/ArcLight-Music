from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Room, Guest
from ..serializers import CreateRoomSerializer, RoomSerializer


# URL: api/room
# Gets all room or Creates room
@api_view(["GET", "POST"])
def RoomView(request, format=None):
    # get all the rooms
    if request.method == "GET":
        queryset = Room.objects.all()
        serializer = RoomSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    # create a room
    # DATA: name, host_id, guest_controller
    if request.method == "POST":
        serializer = RoomSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            host_id = serializer.validated_data.get("host_id")
            try:
                Guest.objects.get(guest_id=host_id)
            except Guest.DoesNotExist:
                return Response(
                    {"error": "guest not found"}, status=status.HTTP_404_NOT_FOUND
                )
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


# URL: api/room/<str:room_code>
# DATA: room_code, guest_id
# Gets/Updates info of a specific room using room_code
@api_view(["GET", "PATCH"])
def SpecificRoomView(request, room_code, format=None):
    # check to see if specified room exists
    try:
        query = Room.objects.get(pk=room_code)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    # GET specific room
    if request.method == "GET":
        serializer = RoomSerializer(instance=query, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Update specific room
    if request.method == "PATCH":
        guest_id = request.data.get("guest_id")
        # only host can update the room
        if guest_id != query.host_id:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        serializer = RoomSerializer(instance=query, data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(update_fields=["name", "guest_controller"])
            return Response(RoomSerializer(query).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# URL: api/join-room/<st:room_code>
# DATA: room_code, guest_id
# Lets guest join room
@api_view(["POST"])
def JoinRoomView(request, room_code, format=None):
    # guest id from session
    guest_id = request.data.get("guest_id")
    if guest_id is not None:
        try:
            room = Room.objects.get(pk=room_code)
        except Room.DoesNotExist:
            return Response(
                {"error": "room not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        # if there is a room
        serializer = RoomSerializer(instance=room, many=False)
        try:
            guest = Guest.objects.get(pk=guest_id)
        except Guest.DoesNotExist:
            return Response(
                {"error": "guest not found"}, status=status.HTTP_404_NOT_FOUND
            )
        room.join(guest)
        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

    return Response({"error": "guest_id not given"}, status=status.HTTP_404_NOT_FOUND)


# URL: api/leave-room/<str:room_code>
# DATA: room_code, guest_id
# Lets guest leave room and if they are the host then the room is deleted
@api_view(["DELETE"])
def LeaveRoomView(request, room_code, format=None):
    guest_id = request.data.get("guest_id")
    print(guest_id)
    if guest_id is not None:
        print("guest_id given")
        try:
            room = Room.objects.get(pk=room_code)
        except:
            return Response(
                {"error": "room not found"}, status=status.HTTP_404_NOT_FOUND
            )
        print("room exists")
        try:
            query_guest = Guest.objects.get(pk=guest_id)
        except:
            return Response(
                {"error": "guest not found"}, status=status.HTTP_404_NOT_FOUND
            )
        print("guest exists")
        if room.host_id == guest_id:
            # guest who is leaving is a host so we will delete room
            print("guest is the host")
            room.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            # remove the guest from the room
            print("guest is not the host")
            room.leave(query_guest)
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
