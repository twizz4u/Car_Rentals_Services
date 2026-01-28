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

export default function CarFormModal({ open, onClose, onSave, car }) {
  const [form, setForm] = useState({
    name: "",
    plate: "",
    pricePerDay: "",
    status: "available",
    image: null,
    preview: null,
  });

  useEffect(() => {
    if (car) {
      setForm({
        ...car,
        image: null,
        preview: car.image || null,
      });
    }
  }, [car]);

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  }

  function submit() {
    onSave(form);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{car ? "Edit Car" : "Add Car"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Car name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            placeholder="Plate number"
            value={form.plate}
            onChange={(e) => setForm({ ...form, plate: e.target.value })}
          />

          <Input
            type="number"
            placeholder="Price per day"
            value={form.pricePerDay}
            onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
          />

          {/* Image upload */}
          <Input type="file" accept="image/*" onChange={handleImage} />

          {form.preview && (
            <img
              src={form.preview}
              alt="preview"
              className="h-32 w-full object-cover rounded-md border"
            />
          )}

          <div className="flex gap-2">
            <Badge
              onClick={() => setForm({ ...form, status: "available" })}
              className="cursor-pointer"
            >
              Available
            </Badge>
            <Badge
              variant="secondary"
              onClick={() => setForm({ ...form, status: "maintenance" })}
              className="cursor-pointer"
            >
              Maintenance
            </Badge>
          </div>

          <Button onClick={submit} className="w-full">
            {car ? "Update Car" : "Add Car"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
