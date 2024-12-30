defmodule Server.BookingParticipants do
  import Ecto.Query
  alias Server.Repo
  alias Server.BookingParticipants.BookingParticipant

  def get_booking_participant(id) do
    Repo.get(BookingParticipant, id)
  end

  def create_booking_participant(attrs \\ %{}) do
    %BookingParticipant{}
    |> BookingParticipant.changeset(attrs)
    |> Repo.insert()
  end

  def update_booking_participant(%BookingParticipant{} = participant, attrs) do
    participant
    |> BookingParticipant.changeset(attrs)
    |> Repo.update()
  end

  def delete_booking_participant(%BookingParticipant{} = participant) do
    Repo.delete(participant)
  end
end
