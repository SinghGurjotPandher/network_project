# Generated by Django 4.2.3 on 2023-08-28 11:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_posts'),
    ]

    operations = [
        migrations.AlterField(
            model_name='posts',
            name='likes',
            field=models.IntegerField(null=True),
        ),
    ]