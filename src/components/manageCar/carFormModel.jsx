import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { API_BASE, useSaveCarMutation } from "../../store/adminApi";

export default function CarFormModal({ open, onClose, onSave, car }) {
  const [saveCarRequest] = useSaveCarMutation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    model: "",
    description: "",
    loan_price: "",
    color: "",
    duration: "",
    status: "available",
    car_image: null,
    preview: null,
  });

  useEffect(() => {
    if (car) {
      setForm({
        ...car,
        loan_price: car.pricePerDay || car.loan_price || "",
        color: car.color && car.color !== "undefined" ? car.color : "",
        duration: car.duration && car.duration !== "undefined" ? car.duration : "",
        description: car.description && car.description !== "undefined" ? car.description : "",
        car_image: null,
        preview: car.image || null,
      });
    } else {
      setForm({
        name: "",
        model: "",
        description: "",
        loan_price: "",
        color: "",
        duration: "",
        status: "available",
        car_image: null,
        preview: null,
      });
    }
  }, [car, open]);



  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      car_image: file,
      preview: URL.createObjectURL(file),
    }));
  }



  async function submit() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("model", form.model);
      formData.append("loan_price", form.loan_price);
      formData.append("color", form.color);
      formData.append("duration", form.duration);
      // formData.append("status", form.status);

      formData.append("description", form.description || "");

      if (form.car_image) {
        formData.append("car_image", form.car_image);
      }

      if (car) {
        // Since we are sending FormData (multipart/form-data) via PHP/Laravel,
        // we send a POST request but specify the _method field as PATCH.
        formData.append("_method", "PATCH");
      }

      // The mutation posts to /api/cars (create) or /api/cars/:id (update) and
      // invalidates the Cars cache on success, so the inventory refreshes
      // itself without an explicit refetch.
      const data = await saveCarRequest({ id: car?.id, formData }).unwrap();

      toast.success(car ? "Car updated successfully" : "Car added successfully");
      onSave(data?.data || form);
      onClose();
    } catch (error) {
      if (error?.status === "FETCH_ERROR") {
        console.error("Submission error:", error);
        toast.error("Network error. Please try again.");
      } else {
        // Backend shapes: { message: ... } for most errors, and
        // { status: 'failed', messages: ..., response: { field: [error] } } for
        // car validation failures.
        const body = error?.data;
        const fieldErrors = Object.values(body?.response || body?.errors || {}).flat();

        if (fieldErrors.length) {
          fieldErrors.forEach((err) => toast.error(err));
        } else {
          toast.error(
            body?.message ||
              body?.messages ||
              (car ? "Failed to update car" : "Failed to add car"),
          );
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-y-auto max-h-[90vh] rounded-[2px]">
        <DialogHeader>
          <DialogTitle className="font-['Playfair_Display',serif] font-normal text-stone-900">{car ? "Edit Car" : "Add Car"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Car name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={loading}
          />

          <Input
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            disabled={loading}
          />

          <textarea
            className="flex min-h-[80px] w-full rounded-[2px] border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:border-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            disabled={loading}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              disabled={loading}
            />
            <Input
              placeholder="Duration"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              disabled={loading}
            />
          </div>

          <Input
            type="number"
            placeholder="Loan price (per day)"
            value={form.loan_price}
            onChange={(e) => setForm({ ...form, loan_price: e.target.value })}
            disabled={loading}
          />

          {/* Image upload */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Car Image</p>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImage}
              disabled={loading}
            />
          </div>

          {form.preview && (
            <img
              src={
                form.preview.startsWith("blob:") || form.preview.startsWith("cars/") || form.preview.startsWith("http")
                  ? form.preview
                  : `${API_BASE}/storage/${form.preview}`
              }
              alt="preview"
              className="h-32 w-full object-cover rounded-[2px] border border-stone-200"
            />
          )}

          <div className="flex gap-2">
            <Badge
              variant={form.status === "available" ? "default" : "outline"}
              onClick={() => !loading && setForm({ ...form, status: "available" })}
              className="cursor-pointer"
            >
              Available
            </Badge>
            <Badge
              variant={form.status === "maintenance" ? "secondary" : "outline"}
              onClick={() => !loading && setForm({ ...form, status: "maintenance" })}
              className="cursor-pointer"
            >
              Maintenance
            </Badge>
          </div>

          <Button onClick={submit} className="w-full rounded-[2px] bg-amber-500 text-black hover:bg-amber-400" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : car ? (
              "Update Car"
            ) : (
              "Add Car"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
