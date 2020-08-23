export const objectiveData = [
    {
        id: 1,
        isOpen: false,
        title: "Enable Standard Portfolio Management Capabilities on a consolidated JIRA instance by Q3",
        description: "test description",
        type: {
          id: 4,
          type: "Company",
          label: "Company"
        },
        parent: null,
        children: [
        ],
        department: {
          id: 1,
          name: "dummy department"
        },
        owner: {
          id: 3,
          firstName: "first name",
          lastName: "last name",
          departments: [
            {
              id: 1,
              name: "dummy department"
            }
          ]
        },
        keyResults: [
            {
              id: 17,
              title: "KR1",
              description: "Consolidation of 3 instances into a single scalable performant JIRA instance.",
              objective: {
                id: 6
              },
              department: {
                id: 1,
                name: "dummy department"
              },
              owner: {
                id: 3,
                firstName: "first name",
                lastName: "last name",
                departments: [
                  {
                    id: 1,
                    name: "dummy department"
                  }
                ]
              },
              currentState: 0,
              targetState: 100,
              notes: null
            },
            {
                id: 17,
                title: "KR2",
                description: "Establish a dedicated team to provide end to end support for consolidated JIRA instance",
                objective: {
                  id: 6
                },
                department: {
                  id: 1,
                  name: "dummy department"
                },
                owner: {
                  id: 3,
                  firstName: "first name",
                  lastName: "last name",
                  departments: [
                    {
                      id: 1,
                      name: "dummy department"
                    }
                  ]
                },
                currentState: 0,
                targetState: 100,
                notes: null
              }
          ],
        startDate: "2020-08-15",
        endDate: "2020-08-15",
        status: "In progress",
        notes: null
      },
    {
      id: 5,
      isOpen: false,
      title: "test",
      description: "test description",
      type: {
        id: 4,
        type: "Company",
        label: "Company"
      },
      parent: null,
      children: [
        {
          id: 6
        }
      ],
      department: {
        id: 1,
        name: "dummy department"
      },
      owner: {
        id: 3,
        firstName: "first name",
        lastName: "last name",
        departments: [
          {
            id: 1,
            name: "dummy department"
          }
        ]
      },
      startDate: "2020-08-15",
      endDate: "2020-08-15",
      keyResults: [],
      status: "In progress",
      notes: null
    },
    {
      id: 6,
      title: "test1",
      description: "test description1",
      type: {
        id: 4,
        type: "Company",
        label: "Company"
      },
      parent: {
        id: 5
      },
      children: [],
      department: {
        id: 1,
        name: "dummy department"
      },
      owner: {
        id: 3,
        firstName: "first name",
        lastName: "last name",
        departments: [
          {
            id: 1,
            name: "dummy department"
          }
        ]
      },
      startDate: "2020-08-15",
      endDate: "2020-08-15",
      keyResults: [
        {
          id: 7,
          title: "title",
          description: "test description",
          objective: {
            id: 6
          },
          department: {
            id: 1,
            name: "dummy department"
          },
          owner: {
            id: 3,
            firstName: "first name",
            lastName: "last name",
            departments: [
              {
                id: 1,
                name: "dummy department"
              }
            ]
          },
          currentState: 0,
          targetState: 100,
          notes: null
        }
      ],
      status: "Closed",
      notes: null
    },
    {
      id: 8,
      title: "objective2-parent",
      description: "test description",
      parent: null,
      children: [
        {
          id: 9
        },
        {
          id: 11
        }
      ]
    },
    {
      id: 9,
      title: "sub-objective2",
      description: "test description",
      parent: {
        id: 8
      },
      children: [
        {
          id: 10
        }
      ]
    },
    {
      id: 10,
      title: "sub-sub-objective2",
      description: "test description",
      parent: {
        id: 9
      },
      children: []
    },
    {
      id: 11,
      title: "sub2-objective2",
      description: "test description",
      parent: {
        id: 8
      },
      children: [],
      keyResults: [
        {
          id: 7,
          title: "title",
          description: "test description",
          objective: {
            id: 6
          },
          department: {
            id: 1,
            name: "dummy department"
          },
          owner: {
            id: 3,
            firstName: "first name",
            lastName: "last name",
            departments: [
              {
                id: 1,
                name: "dummy department"
              }
            ]
          },
          currentState: 0,
          targetState: 100,
          notes: null
        }
      ]
    }
  ];
  