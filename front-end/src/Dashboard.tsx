import { User, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
// import { useGlobalContext } from './GlobalProvider';

const UserDashboard = () => {
  // This would typically come from your auth context or API
//   const user = {
//     name: "Muhammad Usman",
//     email: "i221900@nu.edu.pk"
//   };
const [user,setUser] = useState<any>();
const getUSer = async () => {
    const resp = await axiosInstance.get('/auth/user');
    console.log("userrrr = ", resp.data.decoded.user);
    setUser(resp.data.decoded.user);
}
useEffect(() => {
    getUSer();
},[]);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-sm p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500">Welcome back to your account</p>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-b-lg shadow-sm p-6 mb-6">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 mx-auto">
                <span className="text-xl font-bold text-white">
                  {user?.name.split(' ').map((name: string) => name[0]).join('')}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-center text-gray-900 mb-1">{user?.name}</h3>
              <p className="text-gray-500 text-center mb-6">{user?.email}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <User className="text-blue-500 mr-3" size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-gray-900">{user?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <Mail className="text-blue-500 mr-3" size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              {/* <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center">
                Edit Profile 
                <ChevronRight size={16} className="ml-1" />
              </button> */}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;