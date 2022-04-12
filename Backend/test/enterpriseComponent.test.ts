process.env['PORT'] = 3020;
import { expect } from 'chai';
import userData from './data/user';
import chai from 'chai';
import chaihttp from 'chai-http';
chai.use(chaihttp);
import app from '../server';
import GlobalConfig from './utils/globalConfig';

const request = chai.request.agent(app);

import { createEnterpriseUser } from './utils/userSignUp';
import UserService from '../backend/services/userService';
import ProjectService from '../backend/services/projectService';
import ComponentService from '../backend/services/componentService';

let token: $TSFixMe,
    projectId: string,
    newProjectId: string,
    componentId: $TSFixMe;

describe('Enterprise Component API', function (): void {
    this.timeout(30000);

    before(function (done: $TSFixMe): void {
        this.timeout(40000);
        GlobalConfig.initTestConfig().then(function (): void {
            createEnterpriseUser(
                request,
                userData.user,
                function (err: $TSFixMe, res: $TSFixMe): void {
                    const project = res.body.project;
                    projectId = project._id;

                    request
                        .post('/user/login')
                        .send({
                            email: userData.user.email,
                            password: userData.user.password,
                        })
                        .end(function (err: $TSFixMe, res: $TSFixMe): void {
                            token = res.body.tokens.jwtAccessToken;
                            done();
                        });
                }
            );
        });
    });

    after(async function (): void {
        await GlobalConfig.removeTestConfig();
        await ProjectService.hardDeleteBy({
            _id: { $in: [projectId, newProjectId] },
        });
        await ComponentService.hardDeleteBy({ _id: componentId });
        await UserService.hardDeleteBy({
            email: userData.user.email.toLowerCase(),
        });
    });

    it('should create a new component for project with no billing plan', function (done: $TSFixMe): void {
        const authorization = `Basic ${token}`;
        request
            .post('/project/create')
            .set('Authorization', authorization)
            .send({
                projectName: 'Test Project',
            })
            .end(function (err: $TSFixMe, res: $TSFixMe): void {
                newProjectId = res.body._id;
                request
                    .post(`/component/${newProjectId}`)
                    .set('Authorization', authorization)
                    .send({
                        name: 'New Component',
                    })
                    .end(function (err: $TSFixMe, res: $TSFixMe): void {
                        componentId = res.body._id;
                        expect(res).to.have.status(200);
                        expect(res.body.name).to.be.equal('New Component');
                        done();
                    });
            });
    });
});
