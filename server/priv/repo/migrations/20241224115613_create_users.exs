defmodule Server.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string, null: false
      add :email, :string, null: false
      add :avatar, :string
      add :status, :string, default: "inactive"

      timestamps()
    end

    create unique_index(:users, [:email])
  end
end
