import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminFooter() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost/college_api/get_footer_items.php", {
         credentials: "include",
      });
      const data = await res.json();
      if (data.success) setItems(data.items);
      else setItems([]);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the item permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("http://localhost/college_api/delete_footer_item.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Deleted!", data.message, "success");
        fetchItems();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Footer Item",
      html: `
        <input id="swal-type" class="swal2-input" placeholder="Type" value="${item.type}">
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${item.name}">
        <input id="swal-link" class="swal2-input" placeholder="Link" value="${item.link}">
        <textarea id="swal-icon" class="swal2-textarea" placeholder="Icon SVG">${item.icon_svg || ""}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        const type = document.getElementById("swal-type").value;
        const name = document.getElementById("swal-name").value;
        const link = document.getElementById("swal-link").value;
        const icon_svg = document.getElementById("swal-icon").value;
        if (!type || !name || !link) Swal.showValidationMessage("Type, Name and Link are required");
        return { type, name, link, icon_svg };
      },
    });

    if (!formValues) return;

    try {
      const res = await fetch("http://localhost/college_api/update_footer_item.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, ...formValues }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Updated!", data.message, "success");
        fetchItems();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Add Footer Item",
      html: `
        <input id="swal-type" class="swal2-input" placeholder="Type (service/company/social)">
        <input id="swal-name" class="swal2-input" placeholder="Name">
        <input id="swal-link" class="swal2-input" placeholder="Link">
        <textarea id="swal-icon" class="swal2-textarea" placeholder="Icon SVG"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add",
      preConfirm: () => {
        const type = document.getElementById("swal-type").value;
        const name = document.getElementById("swal-name").value;
        const link = document.getElementById("swal-link").value;
        const icon_svg = document.getElementById("swal-icon").value;
        if (!type || !name || !link) Swal.showValidationMessage("Type, Name and Link are required");
        return { type, name, link, icon_svg };
      },
    });

    if (!formValues) return;

    try {
      const res = await fetch("http://localhost/college_api/add_footer_item.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Added!", data.message, "success");
        fetchItems();
      } else Swal.fire("Error", data.message, "error");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Footer Items</h2>
        <button onClick={handleAdd} className="btn btn-primary">Add Item</button>
      </div>

      <table className="table-auto w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Type</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Link</th>
            <th className="border border-gray-300 px-4 py-2">Icon</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{item.id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.type}</td>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.link}</td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="w-8 items-center" dangerouslySetInnerHTML={{ __html: item.icon_svg || "" }} />
              </td>
              <td className="border border-gray-300  px-4 py-2 flex justify-center gap-2">
                <button onClick={() => handleEdit(item)} className="btn btn-sm btn-warning">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-error">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
