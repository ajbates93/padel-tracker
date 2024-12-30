defmodule Server.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :name, :string
    field :email, :string
    field :avatar, :string
    field :status, :string, default: "inactive"

    has_many :bookings, Server.Bookings.Booking
    has_many :booking_participants, Server.BookingParticipants.BookingParticipant

    timestamps()
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :avatar, :status])
    |> validate_required([:name, :email])
    |> validate_format(:email, ~r/@/)
    |> validate_inclusion(:status, ["active", "inactive"])
  end
end
