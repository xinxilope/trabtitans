module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "googleId", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true, // Garante unicidade para usuários do Google
    });
    await queryInterface.addColumn("Users", "name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "googleId");
    await queryInterface.removeColumn("Users", "name");
  },
};
