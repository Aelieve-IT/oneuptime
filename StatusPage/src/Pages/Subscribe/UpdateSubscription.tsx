import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import Page from '../../Components/Page/Page';
import ModelForm, {
    FormType,
    ModelField,
} from 'CommonUI/src/Components/Forms/ModelForm';
import StatusPageSubscriber from 'Model/Models/StatusPageSubscriber';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import LocalStorage from 'CommonUI/src/Utils/LocalStorage';
import ObjectID from 'Common/Types/ObjectID';
import BadDataException from 'Common/Types/Exception/BadDataException';
import Card from 'CommonUI/src/Components/Card/Card';
import URL from 'Common/Types/API/URL';
import API from '../../Utils/API';
import StatusPageUtil from '../../Utils/StatusPage';
import StatusPagePrivateUser from 'Model/Models/StatusPagePrivateUser';
import { STATUS_PAGE_API_URL } from '../../Utils/Config';
import { SubscribePageProps } from './SubscribePageUtils';
import { CategoryCheckboxOptionsAndCategories } from 'CommonUI/src/Components/CategoryCheckbox/Index';
import PageLoader from 'CommonUI/src/Components/Loader/PageLoader';
import ErrorMessage from 'CommonUI/src/Components/ErrorMessage/ErrorMessage';
import SubscriberUtil from 'CommonUI/src/Utils/StatusPage';
import FormValues from 'CommonUI/src/Components/Forms/Types/FormValues';
import Navigation from 'CommonUI/src/Utils/Navigation';

const SubscribePage: FunctionComponent<SubscribePageProps> = (
    props: SubscribePageProps
): ReactElement => {

    const statusPageSubscriberId: string | undefined =
                Navigation.getLastParamAsObjectID().toString();

    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const statusPageId: ObjectID = LocalStorage.getItem('statusPageId') as ObjectID;

    const [
        categoryCheckboxOptionsAndCategories,
        setCategoryCheckboxOptionsAndCategories,
    ] = useState<CategoryCheckboxOptionsAndCategories>({
        categories: [],
        options: [],
    });

    const [isLaoding, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const fetchCheckboxOptionsAndCategories: Function =
        async (): Promise<void> => {
            try {
                setIsLoading(true);

                const result: CategoryCheckboxOptionsAndCategories =
                    await SubscriberUtil.getCategoryCheckboxPropsBasedOnResources(
                        statusPageId,
                        URL.fromString(STATUS_PAGE_API_URL.toString()).addRoute(
                            `/resources/${statusPageId.toString()}`
                        )
                    );

                setCategoryCheckboxOptionsAndCategories(result);
            } catch (err) {
                setError(API.getFriendlyMessage(err));
            }

            setIsLoading(false);
        };

    useEffect(() => {
        fetchCheckboxOptionsAndCategories().catch((error: Error) => {
            setError(error.message);
        });
    }, []);

    if (!statusPageId) {
        throw new BadDataException('Status Page ID is required');
    }

    if(!statusPageSubscriberId) {
        throw new BadDataException('Status Page Subscriber ID is required');
    }

    StatusPageUtil.checkIfUserHasLoggedIn();

    const fields: Array<ModelField<StatusPageSubscriber>> = [
        {
            field: {
                subscriberEmail: true,
            },
            title: 'Your Email',
            fieldType: FormFieldSchemaType.Email,
            required: true,
            disabled: true,
            placeholder: 'subscriber@company.com',
            showIf: (model: FormValues<StatusPageSubscriber>) => {
                return model && Boolean(model.subscriberEmail);
            },
        },
        {
            field: {
                subscriberPhone: true,
            },
            title: 'Your Phone Number',
            fieldType: FormFieldSchemaType.Email,
            required: true,
            placeholder: '+15853641376',
            disabled: true,
            showIf: (model: FormValues<StatusPageSubscriber>) => {
                return model && Boolean(model.subscriberPhone);
            },
        },
    ];

    if (props.allowSubscribersToChooseResources) {
        fields.push({
            field: {
                isSubscribedToAllResources: true,
            },
            title: 'Subscribe to All Resources',
            description:
                'Select this option if you want to subscribe to all resources.',
            fieldType: FormFieldSchemaType.Checkbox,
            required: false,
            defaultValue: true,
        });

        fields.push({
            field: {
                statusPageResources: true,
            },
            title: 'Select Resources to Subscribe',
            description:
                'Please select the resources you want to subscribe to.',
            fieldType: FormFieldSchemaType.CategoryCheckbox,
            required: false,
            categoryCheckboxProps: categoryCheckboxOptionsAndCategories,
            showIf: (model: FormValues<StatusPageSubscriber>) => {
                return !model || !model.isSubscribedToAllResources;
            },
        });
    }

    fields.push({
        field: {
            isUnsubscribed: true,
        },
        title: 'Unsubscribe',
        description:
            'Please select this if you would like to unsubscribe from all resources.',
        fieldType: FormFieldSchemaType.Toggle,
        required: false,
    });

    return (
        <Page
            
        >
            {isLaoding ? <PageLoader isVisible={isLaoding} /> : <></>}

            {error ? <ErrorMessage error={error} /> : <></>}

            {!isLaoding && !error ? (
                <div className="justify-center">
                    <div>
                        {isSuccess && (
                            <p className="text-center text-gray-400 mb-20 mt-20">
                                {' '}
                                Your changes have been saved.{' '}
                            </p>
                        )}

                        {!isSuccess ? (
                            <div className="">
                                <Card
                                    title="Update Subscription"
                                    description={
                                        'You can update your subscription preferences or unsubscribe here.'
                                    }
                                >
                                    <ModelForm<StatusPageSubscriber>
                                        modelType={StatusPageSubscriber}
                                        id="email-form"
                                        name="Status Page >  Unsubscribe"
                                        fields={fields}
                                        apiUrl={URL.fromString(
                                            STATUS_PAGE_API_URL.toString()
                                        ).addRoute(
                                            `/update-subscription/${statusPageId.toString()}/${statusPageSubscriberId.toString()}}`
                                        )}
                                        requestHeaders={API.getDefaultHeaders(
                                            StatusPageUtil.getStatusPageId()!
                                        )}
                                        formType={FormType.Update}
                                        modelIdToEdit={new ObjectID(statusPageSubscriberId)}
                                        submitButtonText={'Update Subscription'}
                                        onBeforeCreate={async (
                                            item: StatusPageSubscriber
                                        ) => {
                                            const statusPageId: ObjectID =
                                                LocalStorage.getItem(
                                                    'statusPageId'
                                                ) as ObjectID;
                                            if (!statusPageId) {
                                                throw new BadDataException(
                                                    'Status Page ID is required'
                                                );
                                            }

                                            item.statusPageId = statusPageId;
                                            return item;
                                        }}
                                        onSuccess={(
                                            _value: StatusPagePrivateUser
                                        ) => {
                                            setIsSuccess(true);
                                        }}
                                        maxPrimaryButtonWidth={true}
                                    />
                                </Card>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </Page>
    );
};

export default SubscribePage;