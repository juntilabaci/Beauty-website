from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.CharField(max_length=100)
    author_user = models.ForeignKey(
        User, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='posts'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def excerpt(self):
        return self.content[:200] + ('…' if len(self.content) > 200 else '')
