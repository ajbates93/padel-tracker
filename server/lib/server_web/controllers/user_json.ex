defmodule ServerWeb.UserJSON do
  alias Server.Users.User

  def index(%{users: users}) do
    %{
      success: true,
      data: for(user <- users, do: data(user))
    }
  end

  def create(%{user: user}) do
    %{
      success: true,
      data: data(user)
    }
  end

  def error(%{message: message}) do
    %{
      success: false,
      error: message
    }
  end

  def update(%{user: user}) do
    %{
      success: true,
      data: data(user)
    }
  end

  defp data(%User{} = user) do
    %{
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      inserted_at: user.inserted_at,
      updated_at: user.updated_at
    }
  end
end
