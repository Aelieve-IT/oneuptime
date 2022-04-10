export default class Service {
    async create(data: $TSFixMe) {
        const {
            projectId,
            title,
            description,
            incidentPriority,
            isDefault,
            name,
        } = data;

        const query = { projectId, name };
        const select = '_id projectId title description incidentPriority name';
        const incidentSetting = await this.findOne({
            query,
            select,
        });

        if (incidentSetting) {
            const error = new Error(
                'Incident template with this name already exist in project'
            );

            error.code = 400;
            throw error;
        }

        const incidentSettings = new incidentSettingsModel();
        if (isDefault) {
            // there can only be one default incident settings per project
            await incidentSettingsModel.findOneAndUpdate(
                {
                    projectId,
                    isDefault: true,
                },
                {
                    $set: { isDefault: false },
                }
            );
        }

        incidentSettings.projectId = projectId;

        incidentSettings.title = title;

        incidentSettings.description = description;

        incidentSettings.incidentPriority = incidentPriority;

        incidentSettings.isDefault = isDefault || false;

        incidentSettings.name = name;
        return await incidentSettings.save();
    }

    async findBy({ query, limit, skip, populate, select, sort }: FindBy) {
        if (!skip) skip = 0;

        if (!limit) limit = 0;

        if (typeof skip === 'string') skip = Number(skip);

        if (typeof limit === 'string') limit = Number(limit);

        if (!query) query = {};

        if (!query['deleted']) query['deleted'] = false;

        const responseQuery = incidentSettingsModel
            .find(query)
            .lean()
            .sort(sort)
            .limit(limit.toNumber())
            .skip(skip.toNumber());

        responseQuery.select(select);
        responseQuery.populate(populate);
        const result = await responseQuery;

        return result;
    }
    async countBy(query: Query) {
        if (!query) {
            query = {};
        }

        if (!query['deleted']) query['deleted'] = false;
        return await incidentSettingsModel.countDocuments(query);
    }
    async findOne({ query, select, populate, sort }: FindOneBy) {
        if (!query) query = {};
        if (!query['deleted']) query['deleted'] = false;

        const responseQuery = incidentSettingsModel
            .findOne(query)
            .sort(sort)
            .lean();
        responseQuery.select(select);
        responseQuery.populate(populate);

        const incidentSettings = await responseQuery;
        return incidentSettings;
    }

    async updateOne(query: Query, data: $TSFixMe) {
        if (!query) query = {};
        if (!query['deleted']) query['deleted'] = false;

        if (data.name && query.projectId && query._id) {
            const incidentSetting = await this.findOne({
                query: {
                    projectId: query.projectId,
                    name: data.name,
                    _id: { $ne: query._id },
                },
                select: '_id',
            });

            if (incidentSetting) {
                const error = new Error(
                    'Incident template with this name already exist in project'
                );

                error.code = 400;
                throw error;
            }
        }

        if (data.isDefault && query.projectId && query._id) {
            // there can only be one default incident settings per project
            // set any previous isDefault to false
            await incidentSettingsModel.findOneAndUpdate(
                {
                    projectId: query.projectId,
                    _id: { $ne: query._id },
                    isDefault: true,
                },
                { $set: { isDefault: false } }
            );
        }

        await incidentSettingsModel.findOneAndUpdate(
            query,
            {
                $set: data,
            },
            {
                upsert: true,
            }
        );
        const incidentSettings = await this.findOne({
            query,
            select: 'projectId title description incidentPriority isDefault name createdAt',
        });
        return incidentSettings;
    }
    async updateBy(query: Query, data: $TSFixMe) {
        if (!query) {
            query = {};
        }

        if (!query['deleted']) query['deleted'] = false;
        let updatedData = await incidentSettingsModel.updateMany(query, {
            $set: data,
        });
        const populate = [{ path: 'incidentPriority', select: 'name color' }];
        const select =
            'projectId title description incidentPriority isDefault name createdAt';

        updatedData = await this.findBy({ query, select, populate });
        return updatedData;
    }

    async deleteBy(query: Query) {
        const incidentSetting = await this.findOne({
            query,
            select: 'projectId title description incidentPriority isDefault name createdAt',
        });
        if (incidentSetting.isDefault) {
            const error = new Error('Default template cannot be deleted');

            error.code = 400;
            throw error;
        }

        const deletedIncidentSetting =
            await incidentSettingsModel.findOneAndUpdate(
                query,
                {
                    $set: {
                        deleted: true,
                        deletedAt: Date.now(),
                    },
                },
                { new: true }
            );

        return deletedIncidentSetting;
    }

    async hardDeleteBy(query: Query) {
        await incidentSettingsModel.deleteMany(query);
        return 'Incident setting(s) removed successfully!';
    }
}

import incidentSettingsModel from '../Models/incidentSettings';

import FindOneBy from '../types/db/FindOneBy';
import FindBy from '../types/db/FindBy';
import Query from '../types/db/Query';