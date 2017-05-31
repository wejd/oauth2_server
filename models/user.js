module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("users", {

        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        address: DataTypes.STRING,
        mobileId: DataTypes.STRING,
        isAndroidUser: DataTypes.BOOLEAN,
        isIphoneUser: DataTypes.BOOLEAN,
        apnskey: DataTypes.TEXT,
        gcmkey: DataTypes.TEXT,



    }, {
        timestamps: true
    });

    return user;
};