import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function AboutAdmin(){
  const [shortDesc,setShortDesc] = useState("");
  const [desc,setDesc] = useState("");
  const [images,setImages] = useState([]);
  const [imageFiles,setImageFiles] = useState([]);

  const fetchAbout = async ()=>{
    try{
      const res = await fetch("http://localhost/college_api/about_us_crud.php",{credentials:"include"});
      const data = await res.json();
      if(data.success && data.about){
        setShortDesc(data.about.short_description);
        setDesc(data.about.description);
        setImages(data.about.images);
      }
    } catch(err){ console.error(err); }
  }

  useEffect(()=>{ fetchAbout(); },[]);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("short_description", shortDesc);
    formData.append("description", desc);
    for(let f of imageFiles) formData.append("images[]", f);

    try{
      const res = await fetch("http://localhost/college_api/about_us_crud.php",{method:"POST",credentials:"include",body:formData});
      const data = await res.json();
      if(data.success){
        Swal.fire("Saved",data.message,"success");
        setImageFiles([]);
        fetchAbout();
      } else Swal.fire("Error",data.message,"error");
    } catch(err){ console.error(err); Swal.fire("Error","Failed to save","error"); }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">About Us Management</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="Short Description" value={shortDesc} onChange={e=>setShortDesc(e.target.value)} className="border px-3 py-2 rounded"/>
        <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} className="border px-3 py-2 rounded"/>
        
        <div>
          <h3 className="font-semibold mb-1">Images</h3>
          <input type="file" multiple onChange={e=>setImageFiles([...e.target.files])} className="border p-1 rounded"/>
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map(img=><img key={img.id} src={`http://localhost/college_api/uploads/about_us/${img.image_path}`} className="w-24 h-24 object-cover rounded"/>)}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save About Us</button>
      </form>
    </div>
  )
}
