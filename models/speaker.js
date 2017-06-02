module.exports = function(sequelize, DataTypes) {
    var speaker = sequelize.define("speakers", {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        type: DataTypes.STRING,
        num_serie: DataTypes.STRING,
        userId: DataTypes.STRING,
        linked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }


    }, { timestamps: true });

    return speaker;
};