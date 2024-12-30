defmodule ServerWeb.BookingParticipantController do
  use ServerWeb, :controller

  def create(conn, %{"user_id" => user_id, "booking_id" => booking_id} = params) do
    booking_participant_params = %{
      user_id: user_id,
      booking_id: booking_id,
      paid: Map.get(params, "paid", false)
    }

    case Server.BookingParticipants.create_booking_participant(booking_participant_params) do
      {:ok, participant} ->
        json(conn, %{
          success: true,
          data: participant
        })
      {:error, _changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{
          success: false,
          error: "Could not create new booking participant."
        })
    end
  end

  def update(conn, %{"id" => id} = params) do
    with {id, _} <- Integer.parse(id),
         participant <- Server.BookingParticipants.get_booking_participant(id),
         update_params <- build_update_params(params),
         {:ok, updated_participant} <- Server.BookingParticipants.update_booking_participant(participant, update_params) do
      json(conn, %{
        success: true,
        data: updated_participant
      })
    else
      :error ->
        conn
        |> put_status(:bad_request)
        |> json(%{success: false, error: "Booking Participant ID must be a number"})
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{success: false, error: "Booking Participant not found."})
      {:error, _} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{success: false, error: "Could not update booking participant."})
    end
  end

  defp build_update_params(params) do
    params
    |> Map.take(["user_id", "paid"])
    |> Map.put("updated_at", DateTime.utc_now())
    |> Enum.reject(fn {_, v} -> is_nil(v) end)
    |> Map.new()
  end
end
