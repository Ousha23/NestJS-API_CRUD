import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createPostDto: CreatePostDto, userId: any) {
    const { body, title } = createPostDto;
    await this.prismaService.post.create({ data: { title, body, userId } });
    return { data: 'Post created' };
  }

  async getAllPosts() {
    return await this.prismaService.post.findMany({
      include: {
        // user : true, il ramene meme le mot de passe
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
  }
  async delete(postId: number, userId: any) {
    //verif si le post exist
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException('post not found');
    // verif si le créateur qui fait la supp
    if (post.userId !== userId)
      throw new ForbiddenException('Forbidden action');
    await this.prismaService.post.delete({ where: { postId } });
    return { data: 'Post deleted' };
  }

  async update(postId: number, userId: any, updatePostDto: UpdatePostDto) {
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException('post not found');
    // verif si le créateur qui fait la supp
    if (post.userId !== userId)
      throw new ForbiddenException('Forbidden action');
    await this.prismaService.post.update({
      where: { postId },
      data: { ...updatePostDto },
    });
    return { data: 'Post updated' };
  }
}
