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
        }


    }, { timestamps: true });

    return token;
};