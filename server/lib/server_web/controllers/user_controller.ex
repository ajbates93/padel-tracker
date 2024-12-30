defmodule ServerWeb.UserController do
  use ServerWeb, :controller

  def index(conn, params) do
    %{"q" => query, "statuses" => statuses, "sort" => sort, "order" => order} = params

    users =
      Server.Users.list_users()
      |> filter_by_search(query)
      |> filter_by_status(statuses)
      |> sort_users(sort, order)

    render(conn, :index, users: users)
  end

  def create(conn, %{"name" => name, "email" => email, "avatar" => avatar, "status" => status}) do
    case Server.Users.create_user(%{
           name: name,
           email: email,
           avatar: avatar,
           status: status || "inactive"
         }) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> render(:create, user: user)

      {:error, _changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, message: "Could not create new user")
    end
  end

  def update(conn, %{"id" => id} = params) do
    with {:ok, user} <- Server.Users.get_user(id),
         update_params <- build_update_params(params),
         {:ok, updated_user} <- Server.Users.update_user(user, update_params) do
      render(conn, :update, user: updated_user)
    else
      nil ->
        conn
        |> put_status(:not_found)
        |> render(:error, message: "User not found")

      {:error, _} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, message: "Could not update user")
    end
  end

  # Helper functions
  defp filter_by_search(users, nil), do: users

  defp filter_by_search(users, query) do
    Enum.filter(users, fn user ->
      String.match?(user.name, ~r/#{query}/i) ||
        (user.email && String.match?(user.email, ~r/#{query}/i))
    end)
  end

  defp filter_by_status(users, status) when status in [nil, ""], do: users

  defp filter_by_status(users, status) when is_binary(status) do
    filter_by_status(users, String.split(status, ","))
  end

  defp filter_by_status(users, statuses) when is_list(statuses) do
    Enum.filter(users, &(&1.status in statuses))
  end

  defp sort_users(users, nil, _), do: users

  defp sort_users(users, field, order) when field in ["name", "email"] do
    Enum.sort_by(users, &Map.get(&1, String.to_atom(field)), sort_direction(order))
  end

  defp sort_direction("desc"), do: :desc
  defp sort_direction(_), do: :asc

  defp build_update_params(params) do
    params
    |> Map.take(["name", "email", "avatar", "status"])
    |> Map.put("updated_at", DateTime.utc_now())
    |> Enum.reject(fn {_, v} -> is_nil(v) end)
    |> Map.new()
  end
end
