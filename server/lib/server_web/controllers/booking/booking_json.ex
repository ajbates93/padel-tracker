defmodule ServerWeb.BookingJSON do
  alias Server.Bookings.Booking

  def index(%{bookings: bookings}) do
    %{
      success: true,
      data: for(booking <- bookings, do: data(booking))
    }
  end

  def create(%{booking: booking}) do
    %{
      success: true,
      data: data(booking)
    }
  end

  def error(%{message: message}) do
    %{
      success: false,
      error: message
    }
  end

  defp data(%Booking{} = booking) do
    %{
      id: booking.id,
      date: booking.date,
      time: booking.time,
      duration: booking.duration,
      user_id: booking.user_id,
      status: booking.status,
      updated_at: booking.updated_at,
      inserted_at: booking.inserted_at
    }
  end
end
