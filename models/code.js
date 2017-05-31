module.exports = function(sequelize, DataTypes) {
    var code = sequelize.define("codes", {
        value: {
            type: DataTypes.TEXT,
            allowNull: false,

        },
        redirectUri: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clientId: {
            type: DataTypes.STRING,
            allowNull: false,
        }


    }, { timestamps: true });

    return code;
};