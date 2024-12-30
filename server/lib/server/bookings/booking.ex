defmodule Server.Bookings.Booking do
  use Ecto.Schema
  import Ecto.Changeset

  schema "bookings" do
    field :date, :date
    field :time, :time
    field :duration, :integer
    field :status, :string, default: "pending"

    belongs_to :user, Server.Users.User
    has_many :booking_participants, Server.BookingParticipants.BookingParticipant

    timestamps()
  end

  def changeset(booking, attrs) do
    booking
    |> cast(attrs, [:date, :time, :duration, :status, :user_id])
    |> validate_required([:date, :time, :duration, :user_id])
    |> validate_inclusion(:status, ["pending", "confirmed", "cancelled"])
    |> validate_number(:duration, greater_than: 0)
    |> foreign_key_constraint(:user_id)
  end
end
