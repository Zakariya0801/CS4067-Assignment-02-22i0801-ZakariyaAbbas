import { useEffect, useState } from 'react';
import { Clock, Calendar, Users, BookOpen, Check } from 'lucide-react';
import NewEventPopup from './NewEvent';
import eventAxios from "./eventaxios";
import bookingAxios from "./bookingAxios";
import axiosInstance from './axiosInstance';

// Define Event interface
interface Event {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  availability: boolean;
  location: string;
  attendees: number;
  description: string;
  totalSeats: number;
  remainingSeats: number;
  isBooked?: boolean;
}

const EventsPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState<{[key: string]: number}>({});
  
  const [user,setUser] = useState<any>();
  
  const getEvents = async () => {
    try {
      setIsLoading(true);
      const resp = await eventAxios.get('/events');
      const eventsData = resp.data;
      
      // Get user bookings
      const userBookings = await getUserBookings();
      
      // Mark events as booked if they exist in userBookings
      const eventsWithBookingStatus = eventsData.map((event: Event) => {
        // Check if this event is in user's bookings
        const isBooked = userBookings.some((booking: any) => booking.eventId === event._id);
        // Initialize ticket count for this event
        setTicketCount(prev => ({...prev, [event._id]: 1}));
        return {...event, isBooked};
      });
      
      setEvents(eventsWithBookingStatus);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getUserBookings = async () => {
    try {
      const resp = await axiosInstance.get('/auth/user');
      setUser(resp.data.decoded.user);
      const response = await bookingAxios.post('/bookings/user',{
        userId: resp.data.decoded.user.id
      });
      return response.data.bookings || [];
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      return [];
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  // Handler for adding a new event
  const handleAddEvent = async (newEvent: any) => {
    try {
      const response = await eventAxios.post('/events', newEvent);
      if (response.data) {
        setEvents([...events, {...response.data, isBooked: false}]);
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };
  
  // Handle booking an event
  const handleBookEvent = async (event: Event) => {
    console.log("event = ", event);

    // Get user info from localStorage
    const tickets = ticketCount[event._id] || 1;
    
    // Calculate price based on tickets (you might want to customize this)
    const totalPrice = 1000 * tickets; // Assuming each ticket costs 1000
    
    try {
      setBookingInProgress(event._id);
      console.log("user = ", user.id);
      // Create booking payload
      const bookingData = {
        userId: user.id,
        eventId: event._id,
        tickets: tickets,
        totalPrice: totalPrice,
        additionalDetails: `Booking for ${event.name}`
      };
      
      // Send booking request
      await bookingAxios.post('/bookings', bookingData);
      
      // Update event status in the UI
      setEvents(events.map(e => 
        e._id === event._id ? {...e, isBooked: true} : e
      ));
      
      alert("Event booked successfully!");
    } catch (error) {
      console.error("Error booking event:", error);
      alert("Failed to book the event. Please try again.");
    } finally {
      setBookingInProgress(null);
    }
  };
  
  // Handle ticket count changes
  const handleTicketCountChange = (eventId: string, value: number) => {
    if (value >= 1) {
      setTicketCount(prev => ({...prev, [eventId]: value}));
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: "short" as "short",
      month: "short" as "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate event duration in hours
  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime(); 
    const durationMs = endTime - startTime;
    const durationHours = durationMs / (1000 * 60 * 60);
    
    if (durationHours < 24) {
      return `${durationHours} hour${durationHours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(durationHours / 24);
      const remainingHours = durationHours % 24;
      return `${days} day${days !== 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}` : ''}`;
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-sm p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-gray-500">Browse and manage upcoming events</p>
        </div>
        
        {/* Events Grid */}
        <div className="bg-white rounded-b-lg shadow-sm p-6 mb-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">All Events</h2>
            <button 
              onClick={() => setIsPopupOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              + New Event
            </button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading events...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event._id} className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{event.name}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        event.availability 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {event.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="text-blue-500 mr-2" size={18} />
                        <div>
                          <div>Starts: {formatDate(event.startDate)}</div>
                          <div>Ends: {formatDate(event.endDate)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="text-blue-500 mr-2" size={18} />
                        <span>Duration: {calculateDuration(event.startDate, event.endDate)}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-gray-600">
                          <Users className="text-blue-500 mr-2" size={18} />
                          <span>Location: {event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <Users className="text-blue-500 mr-2" size={18} />
                        <span>Attendees: {event.totalSeats - event.remainingSeats} / {event.totalSeats}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {event.isBooked ? (
                        <div className="flex items-center text-green-600">
                          <Check className="mr-2" size={18} />
                          <span className="font-medium">Booked</span>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-700">Tickets:</span>
                            <input
                              type="number"
                              min="1"
                              value={ticketCount[event._id] || 1}
                              onChange={(e) => handleTicketCountChange(event._id, parseInt(e.target.value))}
                              className="border border-gray-300 rounded-md w-16 px-2 py-1 text-center"
                            />
                          </div>
                          <button
                            onClick={() => handleBookEvent(event)}
                            disabled={bookingInProgress === event._id}
                            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            {bookingInProgress === event._id ? (
                              "Booking..."
                            ) : (
                              <>
                                <BookOpen className="mr-2" size={16} />
                                Book Event
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && events.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4 text-gray-400">
                <Calendar size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
              <p className="text-gray-500">Create your first event to get started</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
      <NewEventPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        onAddEvent={handleAddEvent} 
      />
    </div>
  );
};

export default EventsPage;