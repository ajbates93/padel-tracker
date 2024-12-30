defmodule Server.Repo.Migrations.CreateBookings do
  use Ecto.Migration

  def change do
    create table(:bookings) do
      add :date, :date, null: false
      add :time, :time, null: false
      add :duration, :integer, null: false
      add :status, :string, default: "pending"
      add :user_id, references(:users, on_delete: :restrict), null: false

      timestamps()
    end

    create index(:bookings, [:user_id])
    create index(:bookings, [:date])
  end
end
