defmodule Server.BookingParticipants do
  import Ecto.Query
  alias Server.Repo
  alias Server.BookingParticipants.BookingParticipant

  @max_participants 4

  def get_booking_participant(id) do
    Repo.get(BookingParticipant, id)
  end

  def list_booking_participant_by_booking_id(booking_id) do
    query =
      from bp in BookingParticipant,
        where: bp.booking_id == ^booking_id,
        select: bp

    Repo.all(query)
  end

  def create_booking_participant(attrs \\ %{}) do
    booking_id = attrs.booking_id || attrs["booking_id"]

    with current_count <- count_booking_participants(booking_id),
         :ok <- validate_participant_count(current_count) do
      %BookingParticipant{}
      |> BookingParticipant.changeset(attrs)
      |> Repo.insert()
    else
      {:error, :max_participants_reached} ->
        {:error, :max_participants_reached}
    end
  end

  def update_booking_participant(%BookingParticipant{} = participant, attrs) do
    participant
    |> BookingParticipant.changeset(attrs)
    |> Repo.update()
  end

  def delete_booking_participant(%BookingParticipant{} = participant) do
    Repo.delete(participant)
  end

  defp count_booking_participants(booking_id) do
    query =
      from bp in BookingParticipant,
        where: bp.booking_id == ^booking_id,
        select: count(bp.id)

    Repo.one(query)
  end

  defp validate_participant_count(count) when count >= @max_participants do
    {:error, :max_participants_reached}
  end

  defp validate_participant_count(_count), do: :ok
end
