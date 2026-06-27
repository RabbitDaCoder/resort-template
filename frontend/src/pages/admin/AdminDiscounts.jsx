import { useEffect, useState } from "react";
import {
  getDiscounts,
  deleteDiscount,
  toggleDiscount,
  getRooms,
} from "../../services/api";
import DiscountFormModal from "../../components/admin/DiscountFormModal";

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscounts();
    fetchRooms();
  }, []);

  async function fetchDiscounts() {
    const res = await getDiscounts();
    setDiscounts(res.data.data);
    setLoading(false);
  }

  async function fetchRooms() {
    const res = await getRooms();
    const rd = res.data.data || res.data;
    setRooms(Array.isArray(rd) ? rd : []);
  }

  async function handleToggle(id) {
    await toggleDiscount(id);
    fetchDiscounts();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this discount? This cannot be undone.")) return;
    await deleteDiscount(id);
    fetchDiscounts();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl text-[#111111]">
            Discount Management
          </h2>
          <p className="text-[#111111]/40 text-sm mt-1">
            Create and manage room discounts and promotions
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-[#008c8c] text-[#111111] px-6 py-3 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-[#111111] transition-colors"
        >
          + New Discount
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#111111]/5 p-5">
          <p className="text-[10px] text-[#111111]/35 uppercase tracking-[0.15em] font-medium mb-1">
            Total Discounts
          </p>
          <p className="text-2xl font-bold text-[#111111]">
            {discounts.length}
          </p>
        </div>
        <div className="bg-white border border-[#111111]/5 p-5">
          <p className="text-[10px] text-[#111111]/35 uppercase tracking-[0.15em] font-medium mb-1">
            Active Now
          </p>
          <p className="text-2xl font-bold text-[#008c8c]">
            {
              discounts.filter(
                (d) => d.active && new Date(d.endDate) >= new Date(),
              ).length
            }
          </p>
        </div>
        <div className="bg-white border border-[#111111]/5 p-5">
          <p className="text-[10px] text-[#111111]/35 uppercase tracking-[0.15em] font-medium mb-1">
            Expired
          </p>
          <p className="text-2xl font-bold text-red-500">
            {discounts.filter((d) => new Date(d.endDate) < new Date()).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#111111]/5">
        <table className="w-full text-sm">
          <thead className="bg-[#111111]/[0.02] border-b border-[#111111]/5">
            <tr>
              {[
                "Name",
                "Type",
                "Value",
                "Applies To",
                "Period",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[10px] font-semibold text-[#111111]/35 uppercase tracking-[0.15em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => {
              const now = new Date();
              const expired = new Date(d.endDate) < now;
              const upcoming = new Date(d.startDate) > now;

              return (
                <tr
                  key={d._id}
                  className="border-b border-[#111111]/5 hover:bg-[#111111]/[0.01]"
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-[#111111]">{d.name}</p>
                    {d.label && (
                      <span className="text-xs text-[#008c8c]">{d.label}</span>
                    )}
                  </td>
                  <td className="px-4 py-4 capitalize text-[#111111]/60">
                    {d.type}
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#008c8c]">
                    {d.type === "percentage" ? `${d.value}%` : `₱${d.value}`}
                  </td>
                  <td className="px-4 py-4 text-[#111111]/50 text-xs">
                    {d.appliesTo === "all"
                      ? "All Rooms"
                      : d.appliesTo === "specific_rooms"
                        ? `${d.rooms?.length} room(s)`
                        : d.categories?.join(", ")}
                  </td>
                  <td className="px-4 py-4 text-xs text-[#111111]/50">
                    <p>{new Date(d.startDate).toLocaleDateString()}</p>
                    <p>to {new Date(d.endDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-4">
                    {expired ? (
                      <span className="bg-gray-100 text-gray-500 px-2 py-1 text-xs">
                        Expired
                      </span>
                    ) : upcoming ? (
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 text-xs">
                        Upcoming
                      </span>
                    ) : d.active ? (
                      <span className="bg-green-50 text-green-600 px-2 py-1 text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-500 px-2 py-1 text-xs">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(d);
                          setShowForm(true);
                        }}
                        className="text-xs text-[#008c8c] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggle(d._id)}
                        className="text-xs text-[#111111]/40 hover:underline"
                      >
                        {d.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && discounts.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-[#111111]/30">
                  No discounts yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <DiscountFormModal
          discount={editing}
          rooms={rooms}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={() => {
            fetchDiscounts();
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
