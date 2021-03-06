const slug = require('slug');

module.exports = {
  async up(db, client) {
    await db.collection('units').dropIndex('slug_1');
    await db
      .collection('units')
      .find()
      .forEach(async unit => {
        await db.collection('units').updateOne(
          { _id: unit._id },
          {
            $set: {
              displayName: unit.name,
            },
            $unset: { name: '' },
          }
        );

        const project = await db
          .collection('projects')
          .findOne({ _id: unit.project });

        await db.collection('units').updateOne(
          { _id: unit._id },
          {
            $set: {
              name: `${slug(project.name, {
                lower: true,
              })}.${slug(unit.name, { lower: true })}`,
            },
            $unset: { slug: '' },
          }
        );
      });
    await db.collection('units').createIndex({ name: 1 }, { unique: true });
  },

  async down(db, client) {
    await db.collection('units').dropIndex('name_1');
    await db
      .collection('units')
      .find()
      .forEach(async unit => {
        const project = await db
          .collection('projects')
          .findOne({ _id: unit.project });

        await db.collection('units').updateOne(
          { _id: unit._id },
          {
            $set: {
              slug: `${slug(project.name, {
                lower: true,
              })}-${slug(unit.displayName, { lower: true })}`,
            },
            $unset: { name: '' },
          }
        );
        await db.collection('units').updateOne(
          { _id: unit._id },
          {
            $set: {
              name: unit.displayName,
            },
            $unset: { displayName: '' },
          }
        );
      });
    await db.collection('units').createIndex({ slug: 1 }, { unique: true });
  },
};
