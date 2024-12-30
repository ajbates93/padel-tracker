defmodule Server.BookingParticipants.BookingParticipant do
  use Ecto.Schema
  import Ecto.Changeset

  schema "booking_participants" do
    field :paid, :boolean, default: false

    belongs_to :user, Server.Users.User
    belongs_to :booking, Server.Bookings.Booking

    timestamps()
  end

  def changeset(booking_participant, attrs) do
    booking_participant
    |> cast(attrs, [:user_id, :booking_id, :paid])
    |> validate_required([:user_id, :booking_id])
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:booking_id)
    |> unique_constraint([:user_id, :booking_id], name: :booking_participants_user_id_booking_id_index)
  end
end
