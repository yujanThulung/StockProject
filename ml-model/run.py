# from app import app, socketio

# if __name__ == "__main__":
#     socketio.run(app, debug=True, port=6000)



from app import app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
