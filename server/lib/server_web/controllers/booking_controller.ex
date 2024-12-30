defmodule ServerWeb.BookingController do
  use ServerWeb, :controller

  def index(conn, params) do
    bookings = Server.Bookings.list_bookings(params)

    json(conn, %{
      success: true,
      data: bookings
    })
  end

  def create(conn, %{"date" => date, "time" => time, "duration" => duration} = params) do
    booking_params = %{
      date: date,
      time: time,
      duration: duration,
      status: Map.get(params, "status", "pending"),
      user_id: "b28ea0f9-10de-4a97-8642-667b8c68cb65" # TODO: remove hardcoded ID
    }

    case Server.Bookings.create_booking(booking_params) do
      {:ok, booking} ->
        json(conn, %{
          success: true,
          data: booking
        })
      {:error, _changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{
          success: false,
          error: "Could not create new booking."
        })
    end
  end

  # Helper functions similar to UserController...
end
