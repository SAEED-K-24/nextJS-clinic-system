"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { bookAppointment } from "@/actions/appointments";

type BookingFormProps = {
  doctorId: string;
  availableSlots: Record<string, string[]>;
};

function getTodayString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function BookingForm({ doctorId, availableSlots }: BookingFormProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const dateKeys = Object.keys(availableSlots).sort();
  const slotsForDate = selectedDate ? availableSlots[selectedDate] || [] : [];
  const minDate = getTodayString();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("doctorId", doctorId);
      formData.set("date", `${selectedDate}T${selectedTime}:00.000Z`);
      formData.set("notes", notes);

      await bookAppointment(formData);
      toast.success("Appointment booked successfully!");
      router.push("/dashboard/patient");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to book appointment"
      );
    } finally {
      setLoading(false);
    }
  }

  if (dateKeys.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-text-secondary">
            No available slots in the next 30 days.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-text-primary">
          Book Appointment
        </h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime("");
              }}
              className="block w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Choose a date</option>
              {dateKeys.map((key) => (
                <option key={key} value={key}>
                  {new Date(key + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Times
              </label>
              {slotsForDate.length === 0 ? (
                <p className="text-sm text-text-secondary">
                  No slots available on this date
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slotsForDate.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedTime === slot
                          ? "border-primary bg-primary text-white"
                          : "border-border text-text-secondary hover:border-primary hover:text-primary"
                      }`}
                    >
                      {new Date(`2000-01-01T${slot}`).toLocaleTimeString(
                        "en-US",
                        { hour: "numeric", minute: "2-digit" }
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <Input
            id="notes"
            label="Notes (optional)"
            placeholder="Any additional information..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
          />

          <Button
            type="submit"
            loading={loading}
            disabled={!selectedDate || !selectedTime}
            className="w-full"
          >
            Confirm Booking
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
