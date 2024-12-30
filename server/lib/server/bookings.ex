defmodule Server.Bookings do
  import Ecto.Query
  alias Server.Repo
  alias Server.Bookings.Booking

  def list_bookings(params \\ %{}) do
    Booking
    |> filter_by_date(params["where"])
    |> filter_by_status(params["statuses"])
    |> sort_bookings(params["sort"], params["order"])
    |> Repo.all()
  end

  # Move filtering/sorting to database level
  defp filter_by_date(query, nil), do: query
  defp filter_by_date(query, %{"start" => start_date, "end" => end_date}) do
    from b in query,
      where: b.date >= ^Date.from_iso8601!(start_date) and
             b.date <= ^Date.from_iso8601!(end_date)
  end

  defp filter_by_status(query, nil), do: query
  defp filter_by_status(query, statuses) when is_list(statuses) do
    from b in query, where: b.status in ^statuses
  end

  defp sort_bookings(query, nil, _), do: query
  defp sort_bookings(query, field, order) when field in ["date", "time", "duration"] do
    from b in query, order_by: [{^sort_direction(order), ^String.to_atom(field)}]
  end

  defp sort_direction("desc"), do: :desc
  defp sort_direction(_), do: :asc

  def get_booking(id) do
    case Repo.get(Booking, id) do
      nil -> {:error, :not_found}
      booking -> {:ok, booking}
    end
  end

  def create_booking(attrs \\ %{}) do
    %Booking{}
    |> Booking.changeset(attrs)
    |> Repo.insert()
  end

  def update_booking(%Booking{} = booking, attrs) do
    booking
    |> Booking.changeset(attrs)
    |> Repo.update()
  end

  def delete_booking(%Booking{} = booking) do
    Repo.delete(booking)
  end
end
