module.exports = function(sequelize, DataTypes) {
    var speaker = sequelize.define("speakers", {

        name: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        type: DataTypes.STRING,
        num_serie: DataTypes.STRING,
        userId: DataTypes.INTEGER,
        linked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }


    }, { timestamps: true });

    return speaker;
};