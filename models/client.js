module.exports = function(sequelize, DataTypes) {
    var client = sequelize.define("clients", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        idClient: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        secret: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        }


    }, { timestamps: true });

    return client;
};