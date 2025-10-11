import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Admins() {
  const [admins,setAdmins] = useState([]);
  const [loading,setLoading] = useState(true);
  const [modalOpen,setModalOpen] = useState(false);
  const [formData,setFormData] = useState({name:"",email:"",password:""});

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/college_api/get_admins.php",{
        credentials:"include"
      });
      const data = await res.json();
      setAdmins(data);
    } catch(err){ console.error(err); Swal.fire("Error","Failed to fetch admins","error"); }
    setLoading(false);
  };

  useEffect(()=>{ fetchAdmins(); },[]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title:"Are you sure?", text:"This will delete the admin.", icon:"warning", showCancelButton:true
    });
    if(result.isConfirmed){
      try{
        const res = await fetch("http://localhost/college_api/delete_admin.php",{
          method:"POST", credentials:"include",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({id})
        });
        const data = await res.json();
        if(data.success) Swal.fire("Deleted!",data.message,"success");
        else Swal.fire("Error",data.message,"error");
        fetchAdmins();
      }catch{ Swal.fire("Error","Something went wrong","error"); }
    }
  };

  const handleAdd = () => {
    setFormData({name:"",email:"",password:""});
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await fetch("http://localhost/college_api/insert_admin.php",{
        method:"POST", credentials:"include",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success){
        Swal.fire("Success",data.message,"success");
        setModalOpen(false);
        fetchAdmins();
      } else Swal.fire("Error",data.message,"error");
    }catch{ Swal.fire("Error","Something went wrong","error"); }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Admins</h2>
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">Add Admin</button>
      </div>

      {loading ? <div>Loading...</div> :
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(a=>(
            <tr key={a.id} className="border-b border-gray-300 text-center">
              <td className="p-2">{a.id}</td>
              <td className="p-2">{a.name}</td>
              <td className="p-2">{a.email}</td>
              <td className="p-2 space-x-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={()=>handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center">Add Admin</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="Name" className="input input-bordered" value={formData.name} 
                onChange={e=>setFormData({...formData,name:e.target.value})} required />
              <input type="email" placeholder="Email" className="input input-bordered" value={formData.email} 
                onChange={e=>setFormData({...formData,email:e.target.value})} required />
              <input type="password" placeholder="Password" className="input input-bordered" value={formData.password} 
                onChange={e=>setFormData({...formData,password:e.target.value})} required />
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={()=>setModalOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
