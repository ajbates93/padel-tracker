defmodule ServerWeb.BookingController do
  require Logger
  use ServerWeb, :controller

  # Handlers

  def index(conn, params) do
    bookings = Server.Bookings.list_bookings(params)

    render(conn, :index, bookings: bookings)
  end

  def create(conn, %{"date" => date, "time" => time, "duration" => duration} = params) do
    booking_params = %{
      date: date,
      time: time,
      duration: duration,
      status: Map.get(params, "status", "pending"),
      user_id: 1
    }

    case Server.Bookings.create_booking(booking_params) do
      {:ok, booking} ->
        conn
        |> put_status(:created)
        |> render(:create, booking: booking)

      {:error, changeset} ->
        Logger.error("Booking creation failed.")
        IO.inspect(changeset.errors, label: "Changeset Errors")

        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, message: "Could not create new booking")
    end
  end
end
