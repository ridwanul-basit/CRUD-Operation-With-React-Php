import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, FileDown, Edit3 } from "lucide-react";

export default function UniversityAdmin() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUni, setEditUni] = useState(null);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ name:"", short_description:"", facilities:"", contact_numbers:"" });
  const [images, setImages] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchUniversities = async() => {
    setLoading(true);
    try{
      const res = await fetch("http://localhost/college_api/university_crud.php",{credentials:"include"});
      const data = await res.json();
      if(data.success) setUniversities(data.universities);
    }catch{ Swal.fire("Error","Failed to fetch universities","error"); }
    setLoading(false);
  };

  useEffect(()=>{ fetchUniversities(); },[]);

  const toggleSelect = (id)=>setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const toggleSelectAll = ()=>selected.length===filtered.length?setSelected([]):setSelected(filtered.map(u=>u.id));

  const handleDeleteSelected = async(ids=selected)=>{
    if(ids.length===0) return Swal.fire("No selection","Select at least one university","info");
    const confirm = await Swal.fire({title:`Delete ${ids.length} university(s)?`,icon:"warning",showCancelButton:true,confirmButtonText:"Yes, delete"});
    if(!confirm.isConfirmed) return;
    for(const id of ids){
      await fetch("http://localhost/college_api/university_crud.php",{
        method:"POST",credentials:"include",
        headers:{ "Content-Type":"application/x-www-form-urlencoded" },
        body:new URLSearchParams({ action:"delete", ids: id.toString() })
      });
    }
    Swal.fire("Deleted!","University(s) removed","success");
    setSelected([]); fetchUniversities();
  };

  const handleExportSelected = ()=>{
    if(selected.length===0) return Swal.fire("No selection","Select at least one university","info");
    const exportData = universities.filter(u=>selected.includes(u.id));
    const csv = [Object.keys(exportData[0]).join(","), ...exportData.map(u=>[u.id,u.name,u.short_description,u.facilities,u.contact_numbers,u.created_at].join(","))].join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "universities.csv"; link.click();
  };

  const handleEdit = (u)=>{
    setEditUni(u); 
    setForm({name:u.name,short_description:u.short_description,facilities:u.facilities,contact_numbers:u.contact_numbers});
    setImages([]); setModalOpen(true);
  };
  const handleAdd = ()=>{
    setEditUni(null); setForm({name:"",short_description:"",facilities:"",contact_numbers:""}); setImages([]);
    setModalOpen(true);
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!form.name) return Swal.fire("Error","Name required","error");

    const fd = new FormData();
    fd.append("action", editUni?"update":"add");
    fd.append("name", form.name);
    fd.append("short_description", form.short_description);
    fd.append("facilities", form.facilities);
    fd.append("contact_numbers", form.contact_numbers);
    if(editUni) fd.append("id", editUni.id);
    images.forEach(img=>fd.append("images[]",img));

    const res = await fetch("http://localhost/college_api/university_crud.php",{method:"POST",credentials:"include",body:fd});
    const data = await res.json();
    if(data.success){ Swal.fire("Success",data.message,"success"); setModalOpen(false); fetchUniversities(); }
    else Swal.fire("Error",data.message,"error");
  };

  const filtered = universities.filter(u=>u.name.toLowerCase().includes(searchText.toLowerCase()));

  if(loading) return <div className="flex justify-center items-center h-screen text-2xl font-semibold text-indigo-600">Loading universities...</div>;

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🏫 University Management</h1>
        <div className="flex gap-3">
          <input type="text" placeholder="Search..." value={searchText} onChange={e=>setSearchText(e.target.value)} className="input input-bordered px-3 py-2 rounded-lg border shadow"/>
          <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500">Add New</button>
        </div>
      </div>

      {selected.length>0 && (
        <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="flex gap-3 mb-4">
          <button onClick={()=>handleDeleteSelected(selected)} className="bg-red-600 text-white px-4 py-2 rounded-lg">Delete ({selected.length})</button>
          <button onClick={handleExportSelected} className="bg-green-600 text-white px-4 py-2 rounded-lg">Export</button>
        </motion.div>
      )}

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
            <tr>
              <th><input type="checkbox" checked={selected.length===filtered.length && filtered.length>0} onChange={toggleSelectAll}/></th>
              {["ID","Name","Description","Facilities","Contacts","Images","Actions"].map(h=><th key={h} className="p-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u,i)=>(
              <tr key={u.id} className={`hover:bg-indigo-50 ${selected.includes(u.id)?"bg-indigo-100":i%2===0?"bg-white":"bg-gray-50"}`}>
                <td className="p-2"><input type="checkbox" checked={selected.includes(u.id)} onChange={()=>toggleSelect(u.id)}/></td>
                <td>{u.id}</td><td>{u.name}</td><td>{u.short_description}</td><td>{u.facilities}</td><td>{u.contact_numbers}</td>
                <td className="flex gap-1 justify-center">{u.images.map(img=><img key={img} src={`http://localhost/college_api/uploads/university/${img}`} className="w-16 h-12 object-cover rounded"/>)}</td>
                <td className="flex justify-center gap-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={()=>handleEdit(u)}><Edit3 size={14}/></button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={()=>handleDeleteSelected([u.id])}><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan="7" className="py-6 text-gray-500 italic">No universities found 💤</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <motion.div initial={{scale:0.9,y:30}} animate={{scale:1,y:0}} exit={{scale:0.9,y:30}} className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-4">{editUni?"Edit University":"Add University"}</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <input type="text" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="border px-3 py-2 rounded"/>
                <textarea placeholder="Short Description" value={form.short_description} onChange={e=>setForm({...form,short_description:e.target.value})} className="border px-3 py-2 rounded"/>
                <textarea placeholder="Facilities" value={form.facilities} onChange={e=>setForm({...form,facilities:e.target.value})} className="border px-3 py-2 rounded"/>
                <input type="text" placeholder="Contact numbers (comma separated)" value={form.contact_numbers} onChange={e=>setForm({...form,contact_numbers:e.target.value})} className="border px-3 py-2 rounded"/>
                <input type="file" multiple onChange={e=>setImages([...e.target.files])} className="border px-3 py-2 rounded"/>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={()=>setModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500">{editUni?"Update":"Add"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
