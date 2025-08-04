import React, { useState, useEffect, useCallback } from 'react';

// --- Helper Components & Icons ---

const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>;
const Trash2Icon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
const UploadCloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>;
const LoaderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin h-5 w-5 mr-3"><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;


const FormInput = ({ id, label, type, value, onChange, placeholder, icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {icon && icon}
      <input type={type} id={id} name={id} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition" required />
    </div>
  </div>
);

// --- Helper Functions ---
const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`http://localhost:8080${url}`, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('authToken');
        window.location.reload();
    }
    return response;
};

// NEW: Function to decode the JWT and get the roles
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

// --- Teacher Management Components ---
function TeacherForm({ onTeacherAdded, setLoading }) {
  const initialState = { name: '', telephone: '', mobile: '', email: '', address: '', city: '', state: '', institutetype: 'UNIVERSITY' };
  const [formData, setFormData] = useState(initialState);
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true, 'Saving teacher...');
    try {
      const response = await apiFetch('/teacherinfo', { method: 'POST', body: JSON.stringify(formData) });
      if (!response.ok) throw new Error('Failed to save teacher');
      const newTeacherId = await response.json();
      onTeacherAdded({ ...formData, id: newTeacherId }, `Teacher ${formData.name} saved successfully!`);
      setFormData(initialState);
    } catch (error) {
      console.error(error);
      onTeacherAdded(null, 'Error: Failed to save teacher.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><UserPlusIcon /> Add New Teacher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput id="name" label="Full Name" value={formData.name} onChange={handleChange} placeholder="e.g., Dr. Jane Doe" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} placeholder="e.g., jane.doe@example.com" />
            <FormInput id="mobile" label="Mobile Number" type="tel" value={formData.mobile} onChange={handleChange} placeholder="e.g., 9876543210" />
        </div>
        <FormInput id="address" label="Address" value={formData.address} onChange={handleChange} placeholder="e.g., 123 Learning Lane" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput id="city" label="City" value={formData.city} onChange={handleChange} placeholder="e.g., New Delhi" />
            <FormInput id="state" label="State" value={formData.state} onChange={handleChange} placeholder="e.g., Delhi" />
        </div>
        <FormInput id="telephone" label="Telephone" type="tel" value={formData.telephone} onChange={handleChange} placeholder="e.g., 011-12345678" />
        <div>
          <label htmlFor="institutetype" className="block text-sm font-medium text-gray-700 mb-1">Institution Type</label>
          <select id="institutetype" name="institutetype" value={formData.institutetype} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="UNIVERSITY">University</option>
            <option value="COLLEGE">College</option>
            <option value="STANDALONE">Standalone</option>
          </select>
        </div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Teacher</button>
      </form>
    </div>
  );
}
function TeacherList({ teachers, onTeacherDeleted, setLoading, userRoles }) { // Pass userRoles as a prop
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [file, setFile] = useState(null);
  const [aishaCode, setAishaCode] = useState('');
  const isAdmin = userRoles.includes('ROLE_ADMIN'); // Check if user is an admin

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure?')) {
      setLoading(true, 'Deleting teacher...');
      try {
        const response = await apiFetch(`/teacherinfo/${type}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete');
        onTeacherDeleted(id, 'Teacher deleted successfully!');
      } catch (error) {
        console.error(error);
        onTeacherDeleted(null, 'Error: Could not delete teacher.');
      } finally {
        setLoading(false);
      }
    }
  };
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedTeacher) return;
    setLoading(true, 'Uploading file...');
    const uploadData = new FormData();
    uploadData.append('type', selectedTeacher.institutetype);
    uploadData.append('id', selectedTeacher.id);
    uploadData.append('file', file);
    uploadData.append('aisha', aishaCode);
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:8080/teacherinfo/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: uploadData,
        });
        if(!response.ok) throw new Error('Upload failed');
        alert('File uploaded successfully!');
        setSelectedTeacher(null); setFile(null); setAishaCode('');
    } catch(error) {
        console.error(error);
        alert('Error: Failed to upload file.');
    } finally {
        setLoading(false);
    }
  };
  return (
     <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registered Teachers</h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <div key={`${teacher.institutetype}-${teacher.id}`} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center transition-all hover:shadow-md hover:bg-gray-100">
              <div>
                <p className="font-semibold text-indigo-700">{teacher.name}</p>
                <p className="text-sm text-gray-600">{teacher.email}</p>
                <p className="text-xs text-gray-500 uppercase font-medium mt-1">{teacher.institutetype}</p>
              </div>
              {/* NEW: Only show buttons if user is an admin */}
              {isAdmin && (
                <div className="flex items-center space-x-2">
                  <button onClick={() => setSelectedTeacher(teacher)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition" title="Upload Document"><UploadCloudIcon /></button>
                  <button onClick={() => handleDelete(teacher.institutetype, teacher.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition" title="Delete Teacher"><Trash2Icon /></button>
                </div>
              )}
            </div>
          ))
        ) : <p className="text-center text-gray-500 py-8">No teachers found.</p>}
      </div>
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md m-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload for {selectedTeacher.name}</h3>
                <form onSubmit={handleFileUpload} className="space-y-4">
                    <div>
                        <label htmlFor="aishaCode" className="block text-sm font-medium text-gray-700">AISHE Code</label>
                        <input type="text" id="aishaCode" value={aishaCode} onChange={(e) => setAishaCode(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div>
                        <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Document</label>
                        <input type="file" id="fileUpload" onChange={(e) => setFile(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required />
                    </div>
                    <div className="flex justify-end space-x-3 mt-4">
                        <button type="button" onClick={() => setSelectedTeacher(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Upload</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
function TeacherDashboard({ onLogout, showNotification, setLoadingState, userRoles }) { // Pass userRoles as a prop
  const [teachers, setTeachers] = useState([]);
  const [activeType, setActiveType] = useState('UNIVERSITY');
  const isAdmin = userRoles.includes('ROLE_ADMIN'); // Check if user is an admin

  const fetchTeachers = useCallback(async (type) => {
    setLoadingState(true, `Loading ${type.toLowerCase()} teachers...`);
    try {
      const response = await apiFetch(`/teacherinfo?type=${type}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const teachersWithType = data.map(t => ({ ...t, institutetype: type }));
      setTeachers(teachersWithType);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      showNotification('Error: Could not fetch teachers.', 'error');
    } finally {
      setLoadingState(false);
    }
  }, [showNotification, setLoadingState]);
  useEffect(() => { fetchTeachers(activeType); }, [activeType, fetchTeachers]);
  const handleTeacherAdded = (newTeacher, message) => {
    if (newTeacher) {
      if (newTeacher.institutetype === activeType) fetchTeachers(activeType);
      showNotification(message, 'success');
    } else {
      showNotification(message, 'error');
    }
  };
  const handleTeacherDeleted = (deletedId, message) => {
    if (deletedId) {
      setTeachers(prev => prev.filter(t => t.id !== deletedId));
      showNotification(message, 'success');
    } else {
      showNotification(message, 'error');
    }
  };
  const types = ['UNIVERSITY', 'COLLEGE', 'STANDALONE'];
  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600 tracking-tight">Teacher Information Portal</h1>
          <button onClick={onLogout} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
            <LogOutIcon /> Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* NEW: Only show the form if the user is an admin */}
          {isAdmin && (
            <div className="lg:col-span-2">
              <TeacherForm onTeacherAdded={handleTeacherAdded} setLoading={setLoadingState} />
            </div>
          )}
          {/* The list view now takes up more space if the form is hidden */}
          <div className={isAdmin ? "lg:col-span-3" : "lg:col-span-5"}>
            <div className="mb-4 border-b border-gray-200">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {types.map(type => (
                  <button key={type} onClick={() => setActiveType(type)} className={`${activeType === type ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </button>
                ))}
              </nav>
            </div>
            <TeacherList teachers={teachers} onTeacherDeleted={handleTeacherDeleted} setLoading={setLoadingState} userRoles={userRoles} />
          </div>
        </div>
      </main>
    </>
  );
}

// --- Authentication Components ---
function AuthPage({ setAuthInfo, showNotification, setLoadingState }) { // Changed prop name
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';
    setLoadingState(true, isLoginView ? 'Logging in...' : 'Registering...');
    try {
        const response = await fetch(`http://localhost:8080${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'An unknown error occurred');
        }
        if (isLoginView) {
            const data = await response.json();
            const decodedToken = parseJwt(data.token);
            localStorage.setItem('authToken', data.token);
            setAuthInfo({ token: data.token, roles: decodedToken ? decodedToken.roles : [] }); // Set token and roles
            showNotification('Login successful!', 'success');
        } else {
            const successText = await response.text();
            showNotification(successText || 'Registration successful! Please log in.', 'success');
            setIsLoginView(true);
        }
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        setLoadingState(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
            <h1 className="text-4xl font-extrabold mb-4">Teacher Portal</h1>
            <p className="text-lg text-indigo-100 text-center">Streamline the management of educator information with a secure and modern interface.</p>
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              {isLoginView ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-center text-gray-500 mb-8">
              {isLoginView ? 'Sign in to continue' : 'Get started with a free account'}
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FormInput id="email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" icon={<MailIcon />} />
              <FormInput id="password" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" icon={<LockIcon />} />
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {isLoginView ? 'Sign In' : 'Register'}
                </button>
              </div>
            </form>
            <p className="text-sm text-center text-gray-600 mt-8">
              {isLoginView ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={() => setIsLoginView(!isLoginView)} className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                {isLoginView ? 'Register here' : 'Sign in'}
              </button>
            </p>
        </div>
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userRoles, setUserRoles] = useState([]); // NEW: State to hold user roles
  const [loading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [notification, setNotification] = useState({ message: '', type: '' });

  // On initial load, check for a token and decode it to get roles
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
        const decodedToken = parseJwt(storedToken);
        if (decodedToken) {
            setUserRoles(decodedToken.roles || []);
        }
    }
  }, []);

  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 4000);
  }, []);

  const setLoadingState = useCallback((isLoading, message = 'Loading...') => {
    setIsLoading(isLoading);
    if (isLoading) setLoadingMessage(message);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUserRoles([]); // Clear roles on logout
    showNotification('You have been logged out.', 'success');
  };

  const handleSetAuthInfo = ({ token, roles }) => {
    setToken(token);
    setUserRoles(roles);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col justify-center items-center z-50 backdrop-blur-sm">
          <LoaderIcon />
          <p className="text-lg text-gray-700 font-medium">{loadingMessage}</p>
        </div>
      )}
      {notification.message && (
        <div className={`fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} transition-transform transform-gpu animate-bounce-in z-50`}>
          {notification.message}
        </div>
      )}

      {token ? (
        <TeacherDashboard onLogout={handleLogout} showNotification={showNotification} setLoadingState={setLoadingState} userRoles={userRoles} />
      ) : (
        <AuthPage setAuthInfo={handleSetAuthInfo} showNotification={showNotification} setLoadingState={setLoadingState} />
      )}
      
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by React & Spring Boot</p>
      </footer>
    </div>
  );
}

// Add animation styles
const style = document.createElement('style');
style.innerHTML = `
@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.3) translateY(-50px); }
  50% { opacity: 1; transform: scale(1.05) translateY(10px); }
  100% { transform: scale(1) translateY(0); }
}
.animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
`;
document.head.appendChild(style);
