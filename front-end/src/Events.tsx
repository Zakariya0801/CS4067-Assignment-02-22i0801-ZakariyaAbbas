import { useEffect, useState } from 'react';
import { Clock, Calendar, Users } from 'lucide-react';
import NewEventPopup from './NewEvent';
import eventAxios from "./eventaxios"

// import { useGlobalContext } from './GlobalProvider';


const EventsPage = () => {
  //   const { user } = useGlobalContext();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Initial hardcoded events data
  const getEvents = async () =>{
    const resp = await eventAxios.get('/events');
    setEvents(resp.data);
  }

  useEffect(() =>{
    getEvents();
  }, [])
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Annual Tech Conference",
      startDate: "2025-03-15T09:00:00",
      endDate: "2025-03-17T18:00:00",
      availability: true,
      location: "Convention Center",
      attendees: 120,
      description: "A three-day conference focused on emerging technologies and industry trends.",
      totalSeats: 100,
      remainingSeats: 20
      
    }
  ]);

  // Handler for adding a new event
  const handleAddEvent = (newEvent: any) => {
    setEvents([...events, newEvent]);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options = { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate event duration in hours
  const calculateDuration = (start: string, end:string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
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
                      <span>Attendees: {event.totalSeats - event.remainingSeats}</span>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            ))}
          </div>
          
          {events.length === 0 && (
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