defmodule ServerWeb.BookingParticipantController do
  require Logger
  use ServerWeb, :controller

  # Handlers

  def index(conn, params) do
    %{"booking_id" => booking_id} = params

    booking_participants =
      Server.BookingParticipants.list_booking_participant_by_booking_id(booking_id)

    render(conn, :index, booking_participants: booking_participants)
  end

  def create(conn, %{"user_id" => user_id, "booking_id" => booking_id} = params) do
    booking_participant_params = %{
      user_id: user_id,
      booking_id: booking_id,
      paid: Map.get(params, "paid", false)
    }

    case Server.BookingParticipants.create_booking_participant(booking_participant_params) do
      {:ok, booking_participant} ->
        conn
        |> put_status(:created)
        |> render(:create, booking_participant: booking_participant)

      {:error, :max_participants_reached} ->
        conn
        |> put_status(:conflict)
        |> render(:error, message: "Booking already has a maxmimum number of participants")

      {:error, changeset} ->
        Logger.error("Logging error message")
        IO.inspect(changeset.errors, label: "Changeset errors")

        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, message: "Could not create Booking Participant")
    end
  end

  def update(conn, %{"id" => id} = params) do
    with {id, _} <- Integer.parse(id),
         {:ok, participant} <- get_booking_participant_result(id),
         update_params <- build_update_params(params),
         {:ok, updated_participant} <-
           Server.BookingParticipants.update_booking_participant(participant, update_params) do
      render(conn, :update, booking_participant: updated_participant)
    else
      :error ->
        conn
        |> put_status(:bad_request)
        |> render(:error, message: "Booking Participant ID must be a number.")

      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> render(:error, message: "Booking Participant not found.")

      {:error, _} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, message: "Could not update booking participant.")
    end
  end

  # Helpers

  defp build_update_params(params) do
    params
    |> Map.take(["user_id", "paid"])
    |> Map.put("updated_at", DateTime.utc_now())
    |> Enum.reject(fn {_, v} -> is_nil(v) end)
    |> Map.new()
  end

  defp get_booking_participant_result(id) do
    case Server.BookingParticipants.get_booking_participant(id) do
      nil -> {:error, :not_found}
      participant -> {:ok, participant}
    end
  end
end
