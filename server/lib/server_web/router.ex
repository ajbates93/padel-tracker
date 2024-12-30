defmodule ServerWeb.Router do
  use ServerWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  # Keep your existing browser scope
  scope "/", ServerWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Add the new API scope
  scope "/api", ServerWeb do
    pipe_through :api

    # Users
    get "/users", UserController, :index
    post "/users", UserController, :create
    put "/users/:id", UserController, :update

    # Bookings
    get "/bookings", BookingController, :index
    post "/bookings", BookingController, :create

    # Booking Participants
    post "/booking_participants", BookingParticipantController, :create
    put "/booking_participants/:id", BookingParticipantController, :update
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:server, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: ServerWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
