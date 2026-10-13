CREATE TABLE [test_table] (
	[id] int IDENTITY(1, 1),
	[project_name] nvarchar(100) NOT NULL,
	[environment] nvarchar(50) NOT NULL,
	[integrations] nvarchar(200) NOT NULL,
	[created_at] datetime2 NOT NULL,
	CONSTRAINT [test_table_pkey] PRIMARY KEY([id])
);
