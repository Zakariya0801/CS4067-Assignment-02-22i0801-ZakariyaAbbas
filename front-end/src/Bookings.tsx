import { Calendar, Clock, MapPin, Tag, ExternalLink } from 'lucide-react';
// import { useGlobalContext } from './GlobalProvider';
import { useState, useEffect } from 'react';
import bookingAxios from "./bookingAxios"
import eventAxios from "./eventaxios"


// Define the Booking type
interface Booking {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  category: string;
  bookingDate: string;
  totalPrice: number;
  tickets: number;
  bookingStatus: 'confirmed' | 'pending' | 'cancelled';
}

const BookingsPage = () => {
//   const { user } = useGlobalContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call to bookings microservice
        const response = await bookingAxios.get(`bookings/`);
        const data = response.data.bookings;
        // setBookings(data);
        // setTimeout(() =>{},1000);
        // console.log(bookings)
        const updatedBookings = await Promise.all(
          data.map(async (book:any) => {
            const res = await eventAxios.get(`/events/${book.eventId}`);
            return {
              ...book,
              eventDate: res.data.startDate,
              eventName: res.data.name,
              location: res.data.location,
              bookingDate: book.createdAt,
              eventTime: new Date(res.data.startDate).toISOString().split("T")[1].split(".")[0]
            };
          })
        );
        setBookings(updatedBookings);
        
        setIsLoading(false);

        // Mock data for development
        
      } catch (err) {
        // setError('Failed to load bookings. Please try again later.');
        setTimeout(() => {
            setBookings([
              {
                id: '67d0dc07f18709f918667819',
                eventName: 'NASCON',
                eventDate: 'October 15, 2025',
                eventTime: '05:00 am',
                location: 'FAST Islamabad',
                category: 'Technology',
                bookingDate: '2025-03-01',
                bookingStatus: 'confirmed',
                totalPrice: 1200,
                tickets: 4
              },
            //   {
            //     id: 'bk-002',
            //     eventName: 'Music Festival',
            //     eventDate: '2025-05-20',
            //     eventTime: '04:00 PM - 11:00 PM',
            //     location: 'City Park',
            //     category: 'Entertainment',
            //     bookingDate: '2025-03-05',
            //     status: 'confirmed',
            //     ticketCount: 2
            //   },
            //   {
            //     id: 'bk-003',
            //     eventName: 'Workshop: AI Basics',
            //     eventDate: '2025-03-25',
            //     eventTime: '02:00 PM - 04:00 PM',
            //     location: 'Innovation Hub',
            //     category: 'Education',
            //     bookingDate: '2025-03-10',
            //     status: 'pending',
            //     ticketCount: 1
            //   }
            ]);
            setIsLoading(false);
          }, 1000);
        setIsLoading(false);
      }
    };

    // if (user) {
      fetchBookings();
    // }
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-sm p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-1 text-gray-500">View and manage your event bookings</p>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-b-lg shadow-sm p-6 mb-6">
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading your bookings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">You don't have any bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">{booking.eventName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.bookingStatus)}`}>
                        {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="text-blue-500 mr-2" size={18} />
                          <span className="text-gray-700">{formatDate(booking.eventDate)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="text-blue-500 mr-2" size={18} />
                          <span className="text-gray-700">{booking.eventTime}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin className="text-blue-500 mr-2" size={18} />
                          <span className="text-gray-700">{booking.location}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Tag className="text-blue-500 mr-2" size={18} />
                          <span className="text-gray-700">Rs. {booking.totalPrice}</span>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="text-gray-700">
                            <p><span className="font-medium">Booked on:</span> {formatDate(booking.bookingDate)}</p>
                            <p><span className="font-medium">Tickets:</span> {booking.tickets}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                      <button className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200">
                        View details
                        <ExternalLink size={16} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;