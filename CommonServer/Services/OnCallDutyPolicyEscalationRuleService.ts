import PostgresDatabase from '../Infrastructure/PostgresDatabase';
import Model from 'Model/Models/OnCallDutyPolicyEscalationRule';
import DatabaseService, {
    OnCreate,
    OnDelete,
    OnUpdate,
} from './DatabaseService';
import CreateBy from '../Types/Database/CreateBy';
import BadDataException from 'Common/Types/Exception/BadDataException';
import QueryHelper from '../Types/Database/QueryHelper';
import DeleteBy from '../Types/Database/DeleteBy';
import ObjectID from 'Common/Types/ObjectID';
import LIMIT_MAX, { LIMIT_PER_PROJECT } from 'Common/Types/Database/LimitMax';
import SortOrder from 'Common/Types/Database/SortOrder';
import UpdateBy from '../Types/Database/UpdateBy';
import Query from '../Types/Database/Query';
import PositiveNumber from 'Common/Types/PositiveNumber';
import DatabaseCommonInteractionProps from 'Common/Types/Database/DatabaseCommonInteractionProps';
import OnCallDutyPolicyEscalationRuleUser from 'Model/Models/OnCallDutyPolicyEscalationRuleUser';
import OnCallDutyPolicyEscalationRuleUserService from './OnCallDutyPolicyEscalationRuleUserService';
import OnCallDutyPolicyEscalationRuleTeam from 'Model/Models/OnCallDutyPolicyEscalationRuleTeam';
import OnCallDutyPolicyEscalationRuleTeamService from './OnCallDutyPolicyEscalationRuleTeamService';
import TeamMemberService from './TeamMemberService';
import UserNotificationEventType from 'Common/Types/UserNotification/UserNotificationEventType';
import UserNotificationRuleService from './UserNotificationRuleService';
import Dictionary from 'Common/Types/Dictionary';
import OnCallDutyPolicyExecutionLogTimeline from 'Model/Models/OnCallDutyPolicyExecutionLogTimeline';
import OnCallDutyPolicyExecutionLogTimelineService from './OnCallDutyPolicyExecutionLogTimelineService';

export class Service extends DatabaseService<Model> {
    public async startRuleExecution(ruleId: ObjectID, options: {
        projectId: ObjectID,
        triggeredByIncidentId?: ObjectID | undefined,
        userNotificationEventType: UserNotificationEventType,
        onCallPolicyExecutionLogId: ObjectID,
        onCallPolicyId: ObjectID,
    }): Promise<void> {

        // add log timeline. 

        const log: OnCallDutyPolicyExecutionLogTimeline = new OnCallDutyPolicyExecutionLogTimeline();

        log.projectId = options.projectId;
        log.onCallDutyPolicyExecutionLogId = options.onCallPolicyExecutionLogId;
        log.onCallDutyPolicyId = options.onCallPolicyId;
        log.onCallDutyPolicyEscalationRuleId = ruleId;

        if(options.triggeredByIncidentId){
            log.triggeredByIncidentId = options.triggeredByIncidentId;
        }

        log.statusMessage = "Executing escalaton rule."

        await OnCallDutyPolicyExecutionLogTimelineService.create({
            data: log,
            props: {
                isRoot: true,
            }
        });

        if (UserNotificationEventType.IncidentCreated === options.userNotificationEventType && !options.triggeredByIncidentId) {
            throw new BadDataException('triggeredByIncidentId is required when userNotificationEventType is IncidentCreated');
        }

        const usersInRule = await OnCallDutyPolicyEscalationRuleUserService.findBy({
            query: {
                onCallDutyPolicyEscalationRuleId: ruleId,

            },
            props: {
                isRoot: true,
            },
            skip: 0,
            limit: LIMIT_PER_PROJECT,
            select: {
                userId: true
            }
        });

        const teamsInRule = await OnCallDutyPolicyEscalationRuleTeamService.findBy({
            query: {
                onCallDutyPolicyEscalationRuleId: ruleId,

            },
            props: {
                isRoot: true,
            },
            skip: 0,
            limit: LIMIT_PER_PROJECT,
            select: {
                teamId: true
            }
        });

        // get unique users and notify all the users. 

        const uniqueUserIds: Array<ObjectID> = []

        for (const user of usersInRule) {
            if (!uniqueUserIds.find((userId) => user.userId?.toString() === userId.toString())) {
                uniqueUserIds.push(user.userId!);
            }
        }

        const userTeamMap: Dictionary<string> = {};

        for (const teamInRule of teamsInRule) {

            const usersInTeam = await TeamMemberService.getUsersInTeam(teamInRule.teamId!);

            for (const user of usersInTeam) {
                userTeamMap[user.id!.toString()] = (teamInRule.teamId!).toString();
                if (!uniqueUserIds.find((userId) => user.id?.toString() === userId.toString())) {
                    uniqueUserIds.push(user.id!);
                }
            }
        }

        for (const userId of uniqueUserIds) {
            // execute this rule. 
            await UserNotificationRuleService.startUserNotificationRulesExecution(userId, {
                userNotificationEventType: options.userNotificationEventType!,
                triggeredByIncidentId: options.triggeredByIncidentId || undefined,
                onCallPolicyExecutionLogId: options.onCallPolicyExecutionLogId,
                onCallPolicyId: options.onCallPolicyId,
                onCallPolicyEscalationRuleId: ruleId,
            });
        }

    }

    public constructor(postgresDatabase?: PostgresDatabase) {
        super(Model, postgresDatabase);
    }

    protected override async onCreateSuccess(
        onCreate: OnCreate<Model>,
        createdItem: Model
    ): Promise<Model> {
        if (!createdItem.projectId) {
            throw new BadDataException('projectId is required');
        }

        if (!createdItem.id) {
            throw new BadDataException('id is required');
        }

        // add people in escalation rule.

        if (
            onCreate.createBy.miscDataProps &&
            (onCreate.createBy.miscDataProps['teams'] ||
                onCreate.createBy.miscDataProps['users'])
        ) {
            await this.addUsersAndTeams(
                createdItem.projectId,
                createdItem.id,
                createdItem.onCallDutyPolicyId!,
                (onCreate.createBy.miscDataProps['users'] as Array<ObjectID>) ||
                [],
                (onCreate.createBy.miscDataProps['teams'] as Array<ObjectID>) ||
                [],
                onCreate.createBy.props
            );
        }

        return createdItem;
    }

    public async addUsersAndTeams(
        projectId: ObjectID,
        escalationRuleId: ObjectID,
        onCallDutyPolicyId: ObjectID,
        usersIds: Array<ObjectID>,
        teamIds: Array<ObjectID>,
        props: DatabaseCommonInteractionProps
    ): Promise<void> {
        for (const userId of usersIds) {
            await this.addUser(
                projectId,
                escalationRuleId,
                onCallDutyPolicyId,
                userId,
                props
            );
        }

        for (const teamId of teamIds) {
            await this.addTeam(
                projectId,
                escalationRuleId,
                onCallDutyPolicyId,
                teamId,
                props
            );
        }
    }

    public async addTeam(
        projectId: ObjectID,
        escalationRuleId: ObjectID,
        onCallDutyPolicyId: ObjectID,
        teamId: ObjectID,
        props: DatabaseCommonInteractionProps
    ): Promise<void> {
        const teamInRule: OnCallDutyPolicyEscalationRuleTeam =
            new OnCallDutyPolicyEscalationRuleTeam();
        teamInRule.projectId = projectId;
        teamInRule.onCallDutyPolicyId = onCallDutyPolicyId;
        teamInRule.onCallDutyPolicyEscalationRuleId = escalationRuleId;
        teamInRule.teamId = teamId;

        await OnCallDutyPolicyEscalationRuleTeamService.create({
            data: teamInRule,
            props,
        });
    }

    public async addUser(
        projectId: ObjectID,
        escalationRuleId: ObjectID,
        onCallDutyPolicyId: ObjectID,
        userId: ObjectID,
        props: DatabaseCommonInteractionProps
    ): Promise<void> {
        const userInRule: OnCallDutyPolicyEscalationRuleUser =
            new OnCallDutyPolicyEscalationRuleUser();
        userInRule.projectId = projectId;
        userInRule.onCallDutyPolicyId = onCallDutyPolicyId;
        userInRule.onCallDutyPolicyEscalationRuleId = escalationRuleId;
        userInRule.userId = userId;

        await OnCallDutyPolicyEscalationRuleUserService.create({
            data: userInRule,
            props,
        });
    }

    protected override async onBeforeCreate(
        createBy: CreateBy<Model>
    ): Promise<OnCreate<Model>> {
        if (!createBy.data.onCallDutyPolicyId) {
            throw new BadDataException(
                'Status Page Resource onCallDutyPolicyId is required'
            );
        }

        if (!createBy.data.order) {
            const query: Query<Model> = {
                onCallDutyPolicyId: createBy.data.onCallDutyPolicyId,
            };

            const count: PositiveNumber = await this.countBy({
                query: query,
                props: {
                    isRoot: true,
                },
            });

            createBy.data.order = count.toNumber() + 1;
        }

        await this.rearrangeOrder(
            createBy.data.order,
            createBy.data.onCallDutyPolicyId,
            true
        );

        return {
            createBy: createBy,
            carryForward: null,
        };
    }

    protected override async onBeforeDelete(
        deleteBy: DeleteBy<Model>
    ): Promise<OnDelete<Model>> {
        if (!deleteBy.query._id && !deleteBy.props.isRoot) {
            throw new BadDataException(
                '_id should be present when deleting status page resource. Please try the delete with objectId'
            );
        }

        let resource: Model | null = null;

        if (!deleteBy.props.isRoot) {
            resource = await this.findOneBy({
                query: deleteBy.query,
                props: {
                    isRoot: true,
                },
                select: {
                    order: true,
                    onCallDutyPolicyId: true,
                },
            });
        }

        return {
            deleteBy,
            carryForward: resource,
        };
    }

    protected override async onDeleteSuccess(
        onDelete: OnDelete<Model>,
        _itemIdsBeforeDelete: ObjectID[]
    ): Promise<OnDelete<Model>> {
        const deleteBy: DeleteBy<Model> = onDelete.deleteBy;
        const resource: Model | null = onDelete.carryForward;

        if (!deleteBy.props.isRoot && resource) {
            if (resource && resource.order && resource.onCallDutyPolicyId) {
                await this.rearrangeOrder(
                    resource.order,
                    resource.onCallDutyPolicyId,

                    false
                );
            }
        }

        return {
            deleteBy: deleteBy,
            carryForward: null,
        };
    }

    protected override async onBeforeUpdate(
        updateBy: UpdateBy<Model>
    ): Promise<OnUpdate<Model>> {
        if (
            updateBy.data.order &&
            !updateBy.props.isRoot &&
            updateBy.query._id
        ) {
            const resource: Model | null = await this.findOneBy({
                query: {
                    _id: updateBy.query._id!,
                },
                props: {
                    isRoot: true,
                },
                select: {
                    order: true,
                    onCallDutyPolicyId: true,

                    _id: true,
                },
            });

            const currentOrder: number = resource?.order!;
            const newOrder: number = updateBy.data.order as number;

            const resources: Array<Model> = await this.findBy({
                query: {
                    onCallDutyPolicyId: resource?.onCallDutyPolicyId!,
                },

                limit: LIMIT_MAX,
                skip: 0,
                props: {
                    isRoot: true,
                },
                select: {
                    order: true,
                    onCallDutyPolicyId: true,

                    _id: true,
                },
            });

            if (currentOrder > newOrder) {
                // moving up.

                for (const resource of resources) {
                    if (
                        resource.order! >= newOrder &&
                        resource.order! < currentOrder
                    ) {
                        // increment order.
                        await this.updateOneBy({
                            query: {
                                _id: resource._id!,
                            },
                            data: {
                                order: resource.order! + 1,
                            },
                            props: {
                                isRoot: true,
                            },
                        });
                    }
                }
            }

            if (newOrder > currentOrder) {
                // moving down.

                for (const resource of resources) {
                    if (
                        resource.order! < newOrder &&
                        resource.order! >= currentOrder
                    ) {
                        // increment order.
                        await this.updateOneBy({
                            query: {
                                _id: resource._id!,
                            },
                            data: {
                                order: resource.order! - 1,
                            },
                            props: {
                                isRoot: true,
                            },
                        });
                    }
                }
            }
        }

        return { updateBy, carryForward: null };
    }

    private async rearrangeOrder(
        currentOrder: number,
        onCallDutyPolicyId: ObjectID,
        increaseOrder: boolean = true
    ): Promise<void> {
        // get status page resource with this order.
        const resources: Array<Model> = await this.findBy({
            query: {
                order: QueryHelper.greaterThanEqualTo(currentOrder),
                onCallDutyPolicyId: onCallDutyPolicyId,
            },
            limit: LIMIT_MAX,
            skip: 0,
            props: {
                isRoot: true,
            },
            select: {
                _id: true,
                order: true,
            },
            sort: {
                order: SortOrder.Ascending,
            },
        });

        let newOrder: number = currentOrder;

        for (const resource of resources) {
            if (increaseOrder) {
                newOrder = resource.order! + 1;
            } else {
                newOrder = resource.order! - 1;
            }

            await this.updateOneBy({
                query: {
                    _id: resource._id!,
                },
                data: {
                    order: newOrder,
                },
                props: {
                    isRoot: true,
                },
            });
        }
    }
}
export default new Service();
