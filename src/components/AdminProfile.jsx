import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminProfile() {
  const [admin, setAdmin] = useState({name:"",email:""});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({name:"",email:"",password:"",confirmPassword:""});

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/college_api/get_admin_profile.php", {credentials:"include"});
      const data = await res.json();
      if(data.success){
        setAdmin(data.admin);
        setFormData({name:data.admin.name,email:data.admin.email,password:"",confirmPassword:""});
      } else Swal.fire("Error",data.message,"error");
    } catch(err){ Swal.fire("Error","Failed to fetch profile","error"); }
    setLoading(false);
  };

  useEffect(()=>{ fetchProfile(); },[]);

  const handleUpdateProfile = async () => {
    try{
      const res = await fetch("http://localhost/college_api/update_admin_profile.php",{
        method:"POST", credentials:"include",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({name:formData.name,email:formData.email})
      });
      const data = await res.json();
      if(data.success){
        Swal.fire("Success",data.message,"success");
        setEditMode(false);
        fetchProfile();
      } else Swal.fire("Error",data.message,"error");
    } catch{ Swal.fire("Error","Something went wrong","error"); }
  };

  const handleUpdatePassword = async () => {
    if(formData.password!==formData.confirmPassword){
      Swal.fire("Error","Passwords do not match","error");
      return;
    }
    try{
      const res = await fetch("http://localhost/college_api/update_admin_password.php",{
        method:"POST", credentials:"include",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({password:formData.password})
      });
      const data = await res.json();
      if(data.success){
        Swal.fire("Success",data.message,"success");
        setPasswordMode(false);
        setFormData({...formData,password:"",confirmPassword:""});
      } else Swal.fire("Error",data.message,"error");
    } catch{ Swal.fire("Error","Something went wrong","error"); }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({title:"Are you sure?",text:"This will delete your account permanently",icon:"warning",showCancelButton:true});
    if(result.isConfirmed){
      try{
        const res = await fetch("http://localhost/college_api/delete_admin_account.php",{method:"POST",credentials:"include"});
        const data = await res.json();
        if(data.success) Swal.fire("Deleted",data.message,"success").then(()=>window.location.href="/login"); // redirect after delete
        else Swal.fire("Error",data.message,"error");
      } catch{ Swal.fire("Error","Something went wrong","error"); }
    }
  };

  if(loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 ">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>

      <div className="mb-4">
        <label className="font-semibold">Name:</label>
        {editMode ? 
          <input type="text" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="input input-bordered w-full"/> :
          <p>{admin.name}</p>
        }
      </div>

      <div className="mb-4">
        <label className="font-semibold">Email:</label>
        {editMode ? 
          <input type="email" value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} className="input input-bordered w-full"/> :
          <p>{admin.email}</p>
        }
      </div>

      {editMode && (
        <div className="flex gap-2 mb-4">
          <button onClick={handleUpdateProfile} className="btn btn-primary">Save</button>
          <button onClick={()=>setEditMode(false)} className="btn btn-secondary">Cancel</button>
        </div>
      )}

      {!editMode && <button onClick={()=>setEditMode(true)} className="btn btn-primary mb-4">Edit Profile</button>}

      <hr className="my-4 border-gray-300"/>

      <div className="mb-4">
        <label className="font-semibold">Change Password:</label>
        {passwordMode ? (
          <>
            <input type="password" placeholder="New Password" value={formData.password} onChange={e=>setFormData({...formData,password:e.target.value})} className="input input-bordered w-full mb-2"/>
            <input type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={e=>setFormData({...formData,confirmPassword:e.target.value})} className="input input-bordered w-full mb-2"/>
            <div className="flex gap-2">
              <button onClick={handleUpdatePassword} className="btn btn-primary">Update</button>
              <button onClick={()=>setPasswordMode(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </>
        ) : (
          <button onClick={()=>setPasswordMode(true)} className="btn btn-primary ml-3">Change Password</button>
        )}
      </div>

      <hr className="my-4 border-gray-300"/>
      <button onClick={handleDeleteAccount} className="btn btn-danger">Delete Account</button>
    </div>
  );
}
