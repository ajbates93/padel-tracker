defmodule Server.Repo.Migrations.CreateBookingParticipants do
  use Ecto.Migration

  def change do
    create table(:booking_participants) do
      add :paid, :boolean, default: false
      add :user_id, references(:users, on_delete: :restrict), null: false
      add :booking_id, references(:bookings, on_delete: :restrict), null: false

      timestamps()
    end

    create index(:booking_participants, [:user_id])
    create index(:booking_participants, [:booking_id])
    create unique_index(:booking_participants, [:user_id, :booking_id],
      name: :booking_participants_user_id_booking_id_index)
  end
end
