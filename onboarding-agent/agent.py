import uuid

class PrarambhAgent:
    def __init__(self):
        pass

    async def generate_tasks(self, person_info, prompt, assigned_by, assigned_by_name):
        name = person_info.get("name", "New Hire")
        role = person_info.get("role", "Employee")
        team = person_info.get("team", "your team")

        # Create realistic tasks based on the role
        tasks = [
            {
                "id": str(uuid.uuid4()),
                "title": f"Welcome to {team}, {name}!",
                "description": f"Read the {team} manifesto and introduce yourself in the #intros channel.",
                "category": "Culture",
                "estimatedTime": "30 min",
                "priority": "high",
                "subtasks": ["Read manifesto", "Post intro"],
                "status": "pending",
                "playgroundEnabled": False
            },
            {
                "id": str(uuid.uuid4()),
                "title": f"Set up your {role} workstation",
                "description": "Install required software, get access to primary tools, and verify SSO.",
                "category": "Setup",
                "estimatedTime": "2 hrs",
                "priority": "high",
                "subtasks": ["Install software", "Verify SSO", "Set up 2FA"],
                "status": "pending",
                "playgroundEnabled": False
            }
        ]
        
        if "engineer" in role.lower() or "dev" in role.lower():
            tasks.append({
                "id": str(uuid.uuid4()),
                "title": "Complete First Code Challenge",
                "description": "Launch the Code Playground and fix the failing test in the starter repo.",
                "category": "Technical",
                "estimatedTime": "1 hr",
                "priority": "medium",
                "subtasks": ["Launch sandbox", "Fix test", "Submit"],
                "status": "pending",
                "playgroundEnabled": True,
                "playgroundType": "code",
                "playgroundConfig": {
                    "language": "typescript",
                    "files": [
                        {"path": "index.ts", "content": "export function sum(a: number, b: number) {\n  return 0; // TODO: fix\n}"}
                    ]
                }
            })
        elif "sales" in role.lower():
            tasks.append({
                "id": str(uuid.uuid4()),
                "title": "Simulate Prospect Pitch",
                "description": "Reply to the angry prospect in the Mail Playground and handle their objection.",
                "category": "Skills",
                "estimatedTime": "45 min",
                "priority": "medium",
                "subtasks": ["Read context", "Draft reply", "Send"],
                "status": "pending",
                "playgroundEnabled": True,
                "playgroundType": "sales",
                "playgroundConfig": {
                    "prospect": {"name": "John Doe", "company": "Acme Corp", "role": "VP Engineering"}
                }
            })

        return tasks, f"Generated {len(tasks)} tasks tailored for {name} ({role})."

    async def refine_tasks(self, current_tasks, instruction, person_info, assigned_by, assigned_by_name):
        # Simply return the tasks as is for the stub
        return current_tasks, "Refined tasks based on instructions.", "Made minor adjustments."
