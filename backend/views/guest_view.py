from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


from ..models import Guest

from ..serializers import GuestSerializer

# URL: api/guest
# DATA: nickname
# Creates/Updates guests, specifically just the nicknames
@api_view(['POST', 'PATCH'])
def GuestView(request, format=None):
    serializer = GuestSerializer(data=request.data)
    if serializer.is_valid():
        if request.method == 'POST':
            serializer.save()
            request.session['guest_id'] = serializer.data.get('guest_id')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        if request.method == 'PATCH':
            guest_id = serializer.data.get('guest_id')
            try:
                guest = Guest.objects.get(pk=guest_id)
            except Guest.DoesNotExist:
                return Response({'error': 'unable to find guest'}, status=status.HTTP_404_NOT_FOUND)
            guest.save(update_fields=["nickname"])
            return Response(serializer.data, status=status.HTTP_200_OK)
