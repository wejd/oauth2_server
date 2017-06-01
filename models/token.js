module.exports = function(sequelize, DataTypes) {
    var token = sequelize.define("tokens", {
        value: {
            type: DataTypes.TEXT,

            allowNull: false,

        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false

        },
        clientId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        expires_in: {
            type: DataTypes.STRING
        }


    }, { timestamps: true });

    return token;
};