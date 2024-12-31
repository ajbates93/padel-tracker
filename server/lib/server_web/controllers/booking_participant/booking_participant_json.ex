defmodule ServerWeb.BookingParticipantJSON do
  alias Server.BookingParticipants.BookingParticipant

  def index(%{booking_participants: booking_participants}) do
    %{
      success: true,
      data: for(booking_participant <- booking_participants, do: data(booking_participant))
    }
  end

  def create(%{booking_participant: booking_participant}) do
    %{
      success: true,
      data: data(booking_participant)
    }
  end

  def error(%{message: message}) do
    %{
      success: false,
      error: message
    }
  end

  def update(%{booking_participant: booking_participant}) do
    %{
      success: true,
      data: data(booking_participant)
    }
  end

  defp data(%BookingParticipant{} = booking_participant) do
    %{
      id: booking_participant.id,
      paid: booking_participant.paid,
      user_id: booking_participant.user_id,
      booking_id: booking_participant.booking_id,
      inserted_at: booking_participant.inserted_at,
      updated_at: booking_participant.updated_at
    }
  end
end
